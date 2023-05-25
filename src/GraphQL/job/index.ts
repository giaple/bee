import { ItemModel, JobModel, OffsetPaginationInput, OffsetPaginationOptionInput } from "@/dataStructure/categories";
import { QueryHookOptions, gql, useMutation, useQuery } from "@apollo/client";

const GET_JOBS = gql`
  query jobSearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
          jobSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                  _id
                  csId
                  address
                  category {
                    name
                    _id
                  }
                  customerName
                  totalPrice
                  totalDiscountPrice
                  finalTotalPrice
                  phoneNumber
                  status
                  startDate
                  endDate
                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

const CREATE_JOB = gql`
mutation createJob($input: JobCreateInput!) {
    createJob(input: $input) {
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

type TResolveSearchJobsResult = {
    jobSearch: {
    nodes: JobModel[]
  }
}

type QuerySearchJobsArgs = {
    paginationInput: OffsetPaginationInput,
    optionInput: OffsetPaginationOptionInput
}

type MutationOption = {
    onCompleted: (data: any) => Promise<void> | void
}

export const useGetJobs = (options: QueryHookOptions<TResolveSearchJobsResult, QuerySearchJobsArgs>) => {
    const {loading, error, data, refetch, fetchMore} = useQuery(GET_JOBS, {
        ...options
    })

    return {getJobsResult: data, getJobsError: error, getJobsStatus: loading, getJobsRefetch: refetch, getJobsFetchMore: fetchMore}
}

export const useCreateJob = (options: MutationOption) => {
    const [createJob, {data, loading, error}] = useMutation(CREATE_JOB, {...options})

    return {createJob}
}

export const useDeleteItem = (options: MutationOption) => {
    const [deleteItem, {data, loading, error}] = useMutation(DELETE_ITEM, {...options})

    return {deleteItem, deleteItemResult: data, deleteItemStatus: loading, deleteItemError: error}
}