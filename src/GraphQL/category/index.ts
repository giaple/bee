import { OffsetPaginationInput } from "@/dataStructure/categories";
import { OffsetPaginationOptionInput } from "@/dataStructure/categories";
import { CategoryModel } from "@/dataStructure/categories";
import { QueryHookOptions, gql, useMutation, useQuery } from "@apollo/client"

const GET_CATEGORIES = gql`
  query categorySearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
            categorySearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                    _id,
                    ancestorIds,
                    code,
                    createdAt,
                    deactivatedAt,
                    name,
                    parentId,
                    updatedAt
                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

const CREATE_CATEGORY = gql`
mutation createCategory($input: CategoryCreateInput!) {
    createCategory(input: $input) {
        _id
        code
        ancestorIds
        name
        description
        parentId
        createdAt
        updatedAt
        isActive
        imageUrls
    }
    }

`

const DELETE_CATEGORY = gql`
    mutation deleteCategoryById($id: ObjectId!) {
        deleteCategoryById(id: $id) {
            success
            message
        }
}
`


type TResolveSearchCategoriesResult = {
  categorySearch: {
    nodes: CategoryModel[]
  }
}

type QuerySearchCategoriesArgs = {
    paginationInput: OffsetPaginationInput,
    optionInput: OffsetPaginationOptionInput
}

type MutationOption = {
  onCompleted: (data: any) => Promise<void> | void
}

export const useGetCategories = (options: QueryHookOptions<TResolveSearchCategoriesResult, QuerySearchCategoriesArgs>) => {
  const {loading, error, data, refetch, fetchMore} = useQuery<TResolveSearchCategoriesResult, QuerySearchCategoriesArgs>(GET_CATEGORIES, {
    ...options
  })

  return {getCategoryResult: data, getCategoryError: error, getCategoryStatus: loading, getCategoryRefech: refetch, getCategoryFetchMore: fetchMore}
}

export const useCreateCategory = (options: MutationOption) => {
  const [createCategory, {data, loading, error}] = useMutation(CREATE_CATEGORY, {...options})
  return {createCategory, createCategoryResult: data, createCategoryStatus: loading, createCategoryError: error}
}

export const useDeleteCategory = (options: MutationOption) => {
  const [deleteCategory, {data, loading, error}] = useMutation(DELETE_CATEGORY, {...options})
  return {deleteCategory, deleteCategoryResult: data, deleteCategoryStatus: loading, deleteCategoryError: error}
}