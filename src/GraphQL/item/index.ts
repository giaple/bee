import { ItemModel, OffsetPaginationInput, OffsetPaginationOptionInput } from "@/dataStructure/categories";
import { QueryHookOptions, gql, useMutation, useQuery } from "@apollo/client";

const GET_ITEMS = gql`
  query itemSearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
            itemSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                   _id
                   name
                   categoryId
                   category{
                    _id
                    name
                   }
                   options{
                    _id
                    name
                   }
                   subName
                   content
                    createdAt
                    deactivatedAt
                    maxQuantity
                    minQuantity
                    price
                    isActive
                    orderCount
                    price
                    subName

                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

const CREATE_ITEM = gql`
mutation createItem($input: ItemCreateInput!) {
    createItem(input: $input) {
        _id
    }
    }

`

const DELETE_ITEM = gql`
    mutation deleteItemById($id: ObjectId!) {
        deleteItemById(id: $id) {
            success
            message
        }
}
`

type TResolveSearchCategoriesResult = {
    itemSearch: {
    nodes: ItemModel[]
  }
}

type QuerySearchCategoriesArgs = {
    paginationInput: OffsetPaginationInput,
    optionInput: OffsetPaginationOptionInput
}

type MutationOption = {
    onCompleted: (data: any) => Promise<void> | void
}

export const useGetItems = (options: QueryHookOptions<TResolveSearchCategoriesResult, QuerySearchCategoriesArgs>) => {
    const {loading, error, data, refetch, fetchMore} = useQuery(GET_ITEMS, {
        ...options
    })

    return {getItemsResult: data, getItemsError: error, getItemsStatus: loading, getItemsRefetch: refetch, getItemsFetchMore: fetchMore}
}

export const useCreateItem = (options: MutationOption) => {
    const [createItem, {data, loading, error}] = useMutation(CREATE_ITEM, {...options})

    return {createItem, createItemResult: data, createItemStatus: loading, createItemError: error}
}

export const useDeleteItem = (options: MutationOption) => {
    const [deleteItem, {data, loading, error}] = useMutation(DELETE_ITEM, {...options})

    return {deleteItem, deleteItemResult: data, deleteItemStatus: loading, deleteItemError: error}
}