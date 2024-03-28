import { Router } from "express";
import { buyerProductController } from "../../controller/buyer";
import { BaseRouter } from "../interfaces";
const router = Router();

class BuyerProductRouter implements BaseRouter {
    getRoutes() {
        const {
            addProductAsserts,
            addProductOptions,
            createNewProduct,
            deleteProduct,
            removeProductAsserts,
            removeProductOptions,
            updateProduct,
        } = buyerProductController;

        router.post('/', createNewProduct);
        router.delete('/:id', deleteProduct);
        router.put('/:id', updateProduct);

        router.post('/add-asserts', addProductAsserts);
        router.delete('/remove-asserts', removeProductAsserts);

        router.post('/add-options', addProductOptions);
        router.delete('/remove-options', removeProductOptions);

        return router;
    };
}
export const buyerProductRouter = new BuyerProductRouter();
