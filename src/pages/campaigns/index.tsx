import React, { useEffect } from "react";
import { Delete } from '@mui/icons-material';

import Table from "@/components/Table";
import { Column } from "@/dataStructure/columns";
import { CampaignCreateInput, CampaignModel, CategoryModel, ECampaignStatus, ECampaignType, EPromotionTargetCondition, EPromotionTargetType, EPromotionType, ESortOrder, ItemModel, OptionModel, PromotionTargetInput, PromotionTargetModel } from "@/dataStructure/categories";
import Button from "@/components/Button";
import Link from "next/link";
import { objectKeys, parseDate } from "@/utils/func";
import Wrapper from "@/components/Wrapper";
import { useGetOptions } from "@/GraphQL/option";
import { useGetItems } from "@/GraphQL/item";
import Backdrop from "@/components/Backdrop";
import Form, { TextForm } from "@/components/Form";
import { useCreateCampaign, useDeleteCampaign, useGetCampaigns } from "@/GraphQL/compaign";
import { useGetCategories } from "@/GraphQL/category";

import _ from 'lodash'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const compaignColumns = (transFunc: Function, delAction: Function): Column<CampaignModel>[] => [
    {
        label: "name",
        minWidth: 170,
        align: "left",
        render: (campaign: CampaignModel) => <Link href={`/campaigns/${campaign._id}`}><span style={{ textDecoration: 'underline' }}>{`${campaign.name}`}</span></Link>,
        alias: "name",

    },
    {
        label: "code",
        minWidth: 170,
        align: "left",
        render: (campaign: CampaignModel) => campaign.code,
        alias: "code",

    },
    {
        label: "type",
        minWidth: 170,
        align: "left",
        render: (campaign: CampaignModel) => campaign.type,
        alias: "type",

    },
    {
        label: "startDate",
        minWidth: 170,
        align: "left",
        render: (campaign: CampaignModel) => parseDate(campaign.startDate),
        alias: "startDate",
    },
    {
        label: "endDate",
        minWidth: 170,
        align: "left",
        render: (campaign: CampaignModel) => parseDate(campaign.endDate),
        alias: "endDate",

    },
    {
        label: "status",
        minWidth: 170,
        align: "left",
        render: (campaign: CampaignModel) => transFunc(campaign.status),
        alias: "status",

    },
    {
        label: "actions",
        minWidth: 170,
        align: "left",
        render: (campaign: CampaignModel) => <span>
            <Button label="" startIcon={<Delete />} onClick={() => delAction(campaign)} />
        </span>,
        alias: "updatedAt",

    }
]

export const generateCompaignForm = (campaign?: CampaignModel, isEdit?: boolean, target?: string) => ([
    {
        label: "name",
        alias: "name",
        value: campaign?.name || "",
        type: "text",
        required: true,
        fullWidth: true,
        disabled: !isEdit
    },
    {
        label: "type",
        alias: 'type',
        value: campaign?.type || '',
        required: true,
        fullwidth: true,
        type: 'dropdown',
        options: [{ name: ECampaignType.Code, _id: ECampaignType.Code }, { name: ECampaignType.Category, _id: ECampaignType.Category }, { name: ECampaignType.Bill, _id: ECampaignType.Bill }],
        disabled: target ? true : !isEdit
    },
    {
        label: "code",
        alias: "code",
        value: campaign?.code || "",
        type: "text",
        required: true,
        fullWidth: true,
        hide: campaign?.code ? false : true,
        disabled: target ? true : !isEdit
    },
    {
        label: "redemptionAmountLimit",
        alias: "redemptionAmountLimit",
        value: campaign?.redemptionAmountLimit || 0,
        type: "number",
        required: true,
        fullWidth: true,
        disabled: target ? true : !isEdit
    },
    {
        label: "startDate",
        alias: "startDate",
        value: campaign?.startDate ? parseDate(campaign.startDate) : "",
        type: "date",
        required: true,
        fullWidth: true,
        disabled: target ? true : !isEdit
    },
    {
        label: "endDate",
        alias: "endDate",
        value: campaign?.endDate ? parseDate(campaign.endDate) : "",
        type: "date",
        required: true,
        fullWidth: true,
        disabled: target ? true : !isEdit
    },
    {
        label: "description",
        alias: "description",
        value: campaign?.description || "",
        type: "text",
        required: true,
        fullWidth: true,
        disabled: !isEdit
    },
    {
        label: "status",
        alias: "status",
        value: campaign?.status || "",
        type: 'dropdown',
        options: Object.values(ECampaignStatus).map(item => ({ name: item, _id: item })),
        required: true,
        fullWidth: true,
        disabled: true,
        hide: !target
    },
    {
        label: "targets",
        alias: 'targets',
        required: true,
        fullwidth: true,
        type: 'subForm',
        options: [],
        disabled: !isEdit,
    }

]) as TextForm<CampaignModel>[]

export const generatePromotionTargetForm = (targetData?: PromotionTargetModel, isEdit?: boolean) => ([{
    label: "condition",
    alias: 'condition',
    required: true,
    fullwidth: true,
    type: 'dropdown',
    options: [{ name: EPromotionTargetCondition.Or, _id: EPromotionTargetCondition.Or }, { name: EPromotionTargetCondition.Any, _id: EPromotionTargetCondition.Any }],
    value: targetData?.condition ? targetData.condition : '',
    disabled: !isEdit
},
{
    label: "type",
    alias: 'type',
    required: true,
    fullwidth: true,
    type: 'dropdown',
    options: [{ name: EPromotionTargetType.Total, _id: EPromotionTargetType.Total }, { name: EPromotionTargetType.Item, _id: EPromotionTargetType.Item }, { name: EPromotionTargetType.Option, _id: EPromotionTargetType.Option }],
    value: targetData?.type ? targetData.type : '',
    disabled: !isEdit
},
{
    label: "items",
    alias: 'ids',
    required: true,
    fullwidth: true,
    type: 'dropdown',
    options: [],
    hide: targetData?.ids ? false : true,
    value: targetData?.ids ? targetData.ids : [],
    multiSelect: true,
    disabled: !isEdit
},
{
    label: "promotionType",
    alias: 'promotionType',
    required: true,
    fullwidth: true,
    type: 'dropdown',
    options: [{ name: EPromotionType.Discount, _id: EPromotionType.Discount }, { name: EPromotionType.Percent, _id: EPromotionType.Percent }],
    value: targetData?.promotionType ? targetData.promotionType : '',
    disabled: !isEdit
},
{
    label: "value",
    alias: 'value',
    required: true,
    fullWidth: true,
    type: 'number',
    value: targetData?.value ? targetData.value : '',
    disabled: !isEdit
}
])

const Campaigns: React.FC = () => {
    const { t } = useTranslation('common')
    const [form, setForm] = React.useState<TextForm<CampaignModel>[]>(generateCompaignForm(undefined, true))

    const [open, setOpen] = React.useState(false);
    const [updateOpen, setUpdateOpen] = React.useState('');

    const { getCampaignsResult, getCampaignsError, getCampaignsStatus, getCampaignsRefetch } = useGetCampaigns({
        variables: {
            paginationInput: {
                limit: 3,
                pageNumber: 1,
            },
            optionInput: {
                isGetAll: true
            }
        }
    });

    const { getOptionsResult, getOptionsError, getOptionsStatus } = useGetOptions({
        variables: {
            paginationInput: {
                limit: 3,
                pageNumber: 1,
            },
            optionInput: {
                isGetAll: true
            }
        }
    })

    const { getItemsResult, getItemsStatus, getItemsError } = useGetItems({
        variables: {
            paginationInput: {
                limit: 3,
                pageNumber: 1,
            },
            optionInput: {
                isGetAll: true
            }
        }
    })

    const { getCategoryResult, getCategoryStatus, getCategoryError } = useGetCategories({
        variables: {
            paginationInput: {
                limit: 3,
                pageNumber: 1,
            },
            optionInput: {
                isGetAll: true
            }
        }
    })


    const { createCampaign } = useCreateCampaign({
        onCompleted: () => {
            handleClose()
            getCampaignsRefetch()
        }
    })

    const { deleteCampaign } = useDeleteCampaign({
        onCompleted: () => {
            getCampaignsRefetch()
        }
    })

    const handleClose = () => {
        const tempDate = new Date();
        setOpen(false);
        setUpdateOpen(tempDate.toString())
    }

    const handleSave = () => {

        const data: Partial<CampaignCreateInput> = {
        }

        objectKeys(form).forEach((key) => {
            if (form[key].alias === 'targets') {
                data.targets = form[key].options?.map((item) => {
                    const temp: PromotionTargetInput = {
                        condition: item[0].value as EPromotionTargetCondition,
                        type: item[1].value as EPromotionTargetType,
                        ids: item[2].value as string[],
                        promotionType: item[3].value as EPromotionType,
                        value: Number(item[4].value)
                    }
                    return temp
                }) as PromotionTargetInput[]
            } else {
                if (form[key].alias === 'status') return
                data[form[key].alias as keyof CampaignCreateInput] = form[key].alias === 'redemptionAmountLimit' ? Number(form[key].value) : form[key].value
            }
        })


        createCampaign({ variables: { input: data } })
    }

    const delCampaign = (campaign: CampaignModel) => {
        deleteCampaign({ variables: { id: campaign._id } })
    }

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>, index: number, action: string, subIndex: number) => {

        const tempForm = _.cloneDeep(form)

        if (action === 'addSub') {
            const tempTargetForm = generatePromotionTargetForm(undefined, true)
            if (tempForm[1].value === ECampaignType.Bill) {
                tempTargetForm[1].hide = true
                tempTargetForm[1].value = ''
            }
            tempForm[index].options?.push(tempTargetForm)
            setForm(tempForm)
            return
        }

        if (action === 'delSub') {
            tempForm[subIndex].options?.splice(index, 1)
            setForm(tempForm)
            return
        }

        if (subIndex !== undefined) {
            const targetIndex = tempForm.findIndex(form => form.alias === 'targets')
            const updatedItem = tempForm[targetIndex].options?.[subIndex][index]
            if (updatedItem.label === 'type') {
                const idsItem = tempForm[targetIndex].options?.[subIndex]?.find((item) => item.label === 'items')
                const isCategory = tempForm[1].value === ECampaignType.Category
                idsItem.hide = false
                if (e.target.value === EPromotionTargetType.Item) {
                    idsItem.options = getItemsResult?.itemSearch.nodes.filter(node => {
                        if (isCategory) {
                            return node.categoryId?.includes(tempForm[2].value)
                        }
                        return true
                    }).map((item) => ({ name: item.name, _id: item._id }))
                } else if (e.target.value === EPromotionTargetType.Option) {
                    idsItem.options = getOptionsResult?.optionSearch.nodes.filter(node => {
                        if (isCategory) {
                            return node.categoryId?.includes(tempForm[2].value)
                        }
                        return true
                    }).map((item) => ({ name: item.name, _id: item._id }))
                } else if (e.target.value === EPromotionTargetType.Total) {
                    idsItem.hide = true
                }

            }
            updatedItem.value = e.target.value
            setForm(tempForm)
            return
        }

        if (index === 1) {
            const targetIndex = tempForm.findIndex(form => form.alias === 'targets')
            if (e.target.value === ECampaignType.Bill) {

                const subForm = tempForm[targetIndex].options
                subForm?.forEach((item) => {
                    item[1].hide = true
                    item[1].value = ''
                })
                const optionCodeIndex = tempForm.findIndex((item) => item.label === 'code')
                tempForm[optionCodeIndex].hide = false
            } else {
                if (e.target.value === ECampaignType.Code) {
                    const optionCodeIndex = tempForm.findIndex((item) => item.label === 'code')
                    tempForm[optionCodeIndex].hide = false
                } else if (e.target.value === ECampaignType.Category) {
                    const optionCodeIndex = tempForm.findIndex((item) => item.label === 'code')
                    tempForm[optionCodeIndex].hide = false
                    tempForm[optionCodeIndex].type = 'dropdown'
                    tempForm[optionCodeIndex].options = getCategoryResult?.categorySearch.nodes.map((item) => ({ name: item.name, _id: item._id }))
                }
                const subForm = tempForm[targetIndex].options
                subForm?.forEach((item) => {
                    item[1].hide = false
                })
            }
        }

        if (index === 2) {
            if (tempForm[1].value === ECampaignType.Category) {
                const targetsIndex = tempForm.findIndex((item) => item.label === 'targets')
                const subForm = tempForm[targetsIndex].options
                subForm?.forEach(item => {
                    if (item[1].value === EPromotionTargetType.Item) {
                        item[2].options = getItemsResult?.itemSearch.nodes.filter(node => {
                            return node.categoryId?.includes(e.target.value)
                        }).map((item) => ({ name: item.name, _id: item._id }))

                    } else if (item[1].value === EPromotionTargetType.Option) {
                        item[2].options = getOptionsResult?.optionSearch.nodes.filter(node => {
                            return node.categoryId?.includes(e.target.value)
                        }).map((item) => ({ name: item.name, _id: item._id }))
                    }

                })
            }
        }
        tempForm[index].value = e.target.value
        setForm(tempForm);
    }

    if (getCampaignsStatus || getOptionsStatus || getItemsStatus) return <div>Loading...</div>
    if (getCampaignsError || getOptionsError || getItemsError) return <div>Error...</div>

    return <Wrapper label={t("campaigns")}>
        <Backdrop btnLabel={t("campaignObj.add") as string} show={open} update={updateOpen}>
            <Form
                form={form}
                saveBtnLabel={t("save") as string}
                cancelBtnLabel={t("cancel") as string}
                target="CAMPAIGN"
                cancelAction={handleClose}
                submitAction={handleSave}
                handleChange={handleChanges}
            />
        </Backdrop>
        <Table rows={getCampaignsResult?.campaignSearch.nodes || []} columns={compaignColumns(t, delCampaign)} />
    </Wrapper>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "vi", ["common"])),
        },
    };
}

export default Campaigns