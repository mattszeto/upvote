import { Resolver, Query } from "type-graphql";
//set up of graphql server connection to typescript
@Resolver()
export class HelloResolver {
    //graphql query
    @Query(() => String)
    hello() {
        return "hello world";
    }

}