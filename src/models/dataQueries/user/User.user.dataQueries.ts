import AppDataSource from "../../data-source";
import { Shop, User } from "../../entities";
import UserDataQuery, { IUserDataQuery } from "../base/User.base.dataQueries";

interface IUserRoleUserQuery extends IUserDataQuery { }

const userTb = AppDataSource.getRepository(User);


class UserRoleUserDataQuery extends UserDataQuery implements IUserRoleUserQuery {
    async addShopFollow(shop: Shop, id: number) {
        const currentUser = await userTb.findOne({
            where: { id },
            relations: {
                shopFollowing: true,
            }
        });

        currentUser?.shopFollowing.push(shop);
        return await userTb.save(currentUser as User);
    }

    async removeShopFollow(id: number, shopRemoving: Number[]) {
        const currentUser = await userTb.findOne({
            where: { id },
            relations: {
                shopFollowing: true,
            }
        });

        const removedShopFollows = currentUser?.shopFollowing.filter((item) => item.id in shopRemoving);

        return await userTb.save({
            ...currentUser,
            shopFollowing: removedShopFollows
        });
    }

    async getListShopFollowing(id: number) {
        return userTb.findOne({
            select: {
                shopFollowing: true,
            },
            where: { id },
            relations: { shopFollowing: true }
        });
    }
}

export default new UserRoleUserDataQuery();
