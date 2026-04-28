from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import ItemDB


def create(name: str, description: str, db: Session):
    item = ItemDB(name=name, description=description)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_all(db: Session):
    return db.query(ItemDB).all()


def get_one(item_id: int, db: Session):
    item = db.query(ItemDB).filter(ItemDB.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


def update(item_id: int, name: str, description: str, db: Session):
    item = get_one(item_id, db)
    item.name = name
    item.description = description
    db.commit()
    db.refresh(item)
    return item


def delete(item_id: int, db: Session):
    item = get_one(item_id, db)
    db.delete(item)
    db.commit()
