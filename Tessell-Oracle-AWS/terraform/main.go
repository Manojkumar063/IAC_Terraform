package services

import (
	"fmt"
	"strings"
	"time"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	"github.com/hashicorp/terraform-cdk-go/cdktf"
	tessell "github.com/tessell/terraform-provider-tessell-go/tessell"

	"tessell-iac/config"
)

func CreateOracleService(scope cdktf.Construct, cfg config.EnvironmentConfig) {

	tessell.NewTessellDbService(scope, _jsii_.String("oracle_dev_qa"), &tessell.TessellDbServiceConfig{

		Name:        _jsii_.String(fmt.Sprintf("oracle-%s", cfg.Environment)),
		Description: _jsii_.String(fmt.Sprintf("Oracle 19c %s DB", strings.ToUpper(cfg.Environment))),

		Subscription: _jsii_.String("default"),

		EngineType:           _jsii_.String("ORACLE"),
		Edition:              _jsii_.String("STANDARD"),
		Topology:             _jsii_.String("single_instance"),
		SoftwareImage:        _jsii_.String("Oracle 19c SE2"),
		SoftwareImageVersion: _jsii_.String("19.17.0.0.221018"),

		AutoMinorVersionUpdate:  _jsii_.Bool(true),
		EnableDeletionProtection: _jsii_.Bool(cfg.Environment == "prod"),
		EnableStopProtection:     _jsii_.Bool(cfg.Environment == "prod"),
		BlockUntilComplete:       _jsii_.Bool(true),

		Infrastructure: &tessell.TessellDbServiceInfrastructure{

			Cloud:            _jsii_.String("aws"),
			Region:           _jsii_.String(cfg.AwsRegion),
			Vpc:              _jsii_.String(cfg.VpcName),
			ComputeType:      _jsii_.String("tesl_4_a"),

			EnableEncryption:  _jsii_.Bool(true),
			EncryptionKey:     _jsii_.String("default-encryption-key"),
			AdditionalStorage: _jsii_.Number(0),

			Timezone:            _jsii_.String("Asia/Calcutta"),
			EnableComputeSharing: _jsii_.Bool(cfg.Environment != "prod"),
		},

		ServiceConnectivity: &tessell.TessellDbServiceServiceConnectivity{

			ServicePort:       _jsii_.String("1521"),
			EnablePublicAccess: _jsii_.Bool(cfg.Environment != "prod"),
			EnableSSL:         _jsii_.Bool(true),

			AllowedIpAddresses: &[]*string{
				_jsii_.String(cfg.AllowedIP),
			},
		},

		Creds: &tessell.TessellDbServiceCreds{

			MasterUser:     _jsii_.String("admin"),
			MasterPassword: _jsii_.String(cfg.DbMasterPassword),
		},

		SnapshotConfiguration: &tessell.TessellDbServiceSnapshotConfiguration{

			AutoSnapshot: _jsii_.Bool(true),

			Sla: _jsii_.String(func() string {

				if cfg.Environment == "prod" {
					return "PITR-7day"
				}
				return "PITR-1day"

			}()),

			SnapshotStartTime: _jsii_.String("02:00"),
		},

		Tags: &[]*tessell.TessellDbServiceTags{

			{
				Name:  _jsii_.String("environment"),
				Value: _jsii_.String(cfg.Environment),
			},
			{
				Name:  _jsii_.String("team"),
				Value: _jsii_.String("engineering"),
			},
			{
				Name:  _jsii_.String("managed-by"),
				Value: _jsii_.String("terraform"),
			},
			{
				Name:  _jsii_.String("created-date"),
				Value: _jsii_.String(time.Now().Format(time.RFC3339)),
			},
		},

		Lifecycle: &cdktf.TerraformResourceLifecycle{
			PreventDestroy: _jsii_.Bool(cfg.Environment == "prod"),
		},
	})
}