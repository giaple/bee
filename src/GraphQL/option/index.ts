import { OffsetPaginationInput, OptionModel, QueryOptionSearchArgs } from "@/dataStructure/categories";
import { OffsetPaginationOptionInput } from "@/dataStructure/categories";
import { CategoryModel } from "@/dataStructure/categories";
import { QueryHookOptions, gql, useQuery } from "@apollo/client"

const GET_OPTIONS = gql`
  query optionSearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
            optionSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                   _id
                   name
                   categoryId
                   category{
                    _id
                    name
                   }
                   isActive
                    createdAt
                    deactivatedAt
                    updatedAt
                    maxQuantity
                    minQuantity
                    price

                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

type TResolveSearchCategoriesResult = {
    optionSearch: {
    nodes: OptionModel[]
  }
}

export const useGetOptions = (options: QueryHookOptions<TResolveSearchCategoriesResult, QueryOptionSearchArgs>) => {
  const {loading, error, data, refetch, fetchMore} = useQuery<TResolveSearchCategoriesResult, QueryOptionSearchArgs>(GET_OPTIONS, {
    ...options
  })

  return {getOptionsResult: data, getOptionsError: error, getOptionsStatus: loading, getOptionsRefetch: refetch, getOptionsFetchMore: fetchMore}
}