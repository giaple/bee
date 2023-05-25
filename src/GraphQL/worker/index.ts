import { OffsetPaginationInput } from "@/dataStructure/categories";
import { OffsetPaginationOptionInput } from "@/dataStructure/categories";
import { WorkerModel } from "@/dataStructure/categories";
import { QueryHookOptions, gql, useQuery } from "@apollo/client"

const GET_WORKERS = gql`
  query workerSearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
            workerSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                    _id
                    phoneCountryCode
                    phoneNumber
                    firstName
                    lastName
                    fullName
                    role
                    isAvailable
                    isActive
                    createdAt
                    updatedAt
                    dob
                    email

                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

type TResolveSearchWorkersResult = {
  workerSearch: {
    nodes: WorkerModel[]
  }
}

type QuerySearchWorkerArgs = {
    paginationInput: OffsetPaginationInput,
    optionInput: OffsetPaginationOptionInput
}

export const useGetWorkers = (options: QueryHookOptions<TResolveSearchWorkersResult, QuerySearchWorkerArgs>) => {
  const {loading, error, data, refetch, fetchMore} = useQuery<TResolveSearchWorkersResult, QuerySearchWorkerArgs>(GET_WORKERS, {
    ...options
  })

  return {getWorkersResult: data, getWorkersError: error, getWorkersStatus: loading, getWorkersRefech: refetch, getWorkersFetchMore: fetchMore}
}