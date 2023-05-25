import { CustomerModel, OffsetPaginationInput } from "@/dataStructure/categories";
import { OffsetPaginationOptionInput } from "@/dataStructure/categories";
import { CategoryModel } from "@/dataStructure/categories";
import { QueryHookOptions, gql, useQuery } from "@apollo/client"

const GET_CUSTOMERS = gql`
  query customerSearch($paginationInput: OffsetPaginationInput! 
    $optionInput: OffsetPaginationOptionInput) {
        customerSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
            nodes {
                _id,
                address
                dob,
                lastName,
                firstName,
                gender,
                phoneNumber,
                email

            }
            pageNumber
            pageSize
            totalCount
        }
  }
`;

type TResolveSearchCustomersResult = {
  customersSearch: {
    nodes: CustomerModel[]
  }
}

type QuerySearchCustomersArgs = {
    paginationInput: OffsetPaginationInput,
    optionInput: OffsetPaginationOptionInput
}

export const useGetCustomers = (options: QueryHookOptions<TResolveSearchCustomersResult, QuerySearchCustomersArgs>) => {
  const {loading, error, data, refetch, fetchMore} = useQuery<TResolveSearchCustomersResult, QuerySearchCustomersArgs>(GET_CUSTOMERS, {
    ...options
  })

  return {getCustomersResult: data, getCustomersError: error, getCustomersStatus: loading, getCustomersRefech: refetch, getCustomersFetchMore: fetchMore}
}