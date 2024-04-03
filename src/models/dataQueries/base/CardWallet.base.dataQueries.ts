import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import AppDataSource from "../../data-source";
import { CardWallet } from "../../entities";

export interface ICardWalletBaseDataQuery {
    getAll(userId: number): Promise<CardWallet[]>;
    softDelete(id: number): Promise<UpdateResult>;
    hardDelete(id: number): Promise<DeleteResult>;
    addCard(payload: DeepPartial<CardWallet>): Promise<CardWallet>;
}

const cardWalletTb = AppDataSource.getTreeRepository(CardWallet);

export class CardWalletBaseDataQuery implements ICardWalletBaseDataQuery {
    getAll(userId: number) {
        return cardWalletTb.find({
            select: {
                id: true,
                author: {
                    id: true
                },
                bankId: true,
                cardNumber: true,
                csv: true,
                isDisable: true,
            },
            where: {
                author: {
                    id: userId
                }
            },
            relations: {
                author: true
            }
        });
    }

    softDelete(id: number) {
        return cardWalletTb.update(id, { isDisable: true });
    }

    hardDelete(id: number) {
        return cardWalletTb.delete(id);
    }

    async addCard(payload: DeepPartial<CardWallet>) {
        const newCard = await cardWalletTb.create(payload);
        await cardWalletTb.save(newCard);
        return newCard;
    }
}
