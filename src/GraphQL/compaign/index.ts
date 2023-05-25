import { CampaignModel, OffsetPaginationInput, OffsetPaginationOptionInput } from "@/dataStructure/categories";
import { QueryHookOptions, gql, useMutation, useQuery } from "@apollo/client";

const GET_CAMPAIGNS = gql`
  query campaignSearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
          campaignSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                  _id
                  code
                  createdAt
                  description
                  endDate
                  name
                  startDate
                  status
                  usedAmount
                  usedCount
                  type
                  status
                  redemptionAmountLimit
                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

const CREATE_CAMPAIGN = gql`
mutation createCampaign($input: CampaignCreateInput!) {
  createCampaign(input: $input) {
        _id
    }
    }

`

const DELETE_CAMPAIGN = gql`
    mutation deleteCampaignById($id: ObjectId!) {
      deleteCampaignById(id: $id) {
            success
            message
        }
}
`

type TResolveSearchCampaignResult = {
    campaignSearch: {
    nodes: CampaignModel[]
  }
}

type QuerySearchCampaignArgs = {
    paginationInput: OffsetPaginationInput,
    optionInput: OffsetPaginationOptionInput
}

type MutationOption = {
    onCompleted: (data: any) => Promise<void> | void
}

export const useGetCampaigns = (options: QueryHookOptions<TResolveSearchCampaignResult, QuerySearchCampaignArgs>) => {
    const {loading, error, data, refetch, fetchMore} = useQuery(GET_CAMPAIGNS, {
        ...options
    })

    return {getCampaignsResult: data, getCampaignsError: error, getCampaignsStatus: loading, getCampaignsRefetch: refetch, getCampaignsFetchMore: fetchMore}
}

export const useCreateCampaign = (options: MutationOption) => {
    const [createCampaign, {data, loading, error}] = useMutation(CREATE_CAMPAIGN, {...options})

    return {createCampaign, createItemResult: data, createItemStatus: loading, createItemError: error}
}

export const useDeleteCampaign = (options: MutationOption) => {
    const [deleteCampaign, {data, loading, error}] = useMutation(DELETE_CAMPAIGN, {...options})

    return {deleteCampaign, deleteItemResult: data, deleteItemStatus: loading, deleteItemError: error}
}