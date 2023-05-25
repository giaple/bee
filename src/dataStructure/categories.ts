export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date custom scalar type */
  Date: { input: any; output: any; }
  /** MongoDB ObjectId scalar type, sent as 24 byte Hex String */
  ObjectId: { input: any; output: any; }
};

export type AdminCreateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminNote?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<EGender>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
  role?: InputMaybe<EAdminRoleType>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type AdminDeleteInput = {
  isForce?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AdminModel = {
  __typename?: 'AdminModel';
  _id: Scalars['ObjectId']['output'];
  address?: Maybe<Scalars['String']['output']>;
  adminNote?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  deactivatedAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<EGender>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phoneCountryCode: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  role: EAdminRoleType;
  updatedAt: Scalars['Date']['output'];
  ward?: Maybe<Scalars['String']['output']>;
};

export type AdminModelEdge = {
  __typename?: 'AdminModelEdge';
  cursor: Scalars['String']['output'];
  node: AdminModel;
};

export type AdminSearchQueryInput = {
  isDeleted?: InputMaybe<BooleanFilterInput>;
};

export type AdminUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminNote?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<EGender>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<EAdminRoleType>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type AppliedCampaignInput = {
  appliedTargets?: InputMaybe<Array<AppliedCampaignTargetInput>>;
  code: Scalars['String']['input'];
  refId: Scalars['ObjectId']['input'];
  type: ECampaignType;
};

export type AppliedCampaignModel = {
  __typename?: 'AppliedCampaignModel';
  appliedTargets?: Maybe<Array<AppliedCampaignTargetModel>>;
  code: Scalars['String']['output'];
  refId?: Maybe<Scalars['ObjectId']['output']>;
  type: ECampaignType;
};

export type AppliedCampaignTargetInput = {
  condition: EPromotionTargetCondition;
  name: Scalars['String']['input'];
  promotionType: EPromotionType;
  refId: Scalars['ObjectId']['input'];
  targetType: EPromotionTargetType;
  value: Scalars['Float']['input'];
};

export type AppliedCampaignTargetModel = {
  __typename?: 'AppliedCampaignTargetModel';
  condition: EPromotionTargetCondition;
  name: Scalars['String']['output'];
  promotionType: EPromotionType;
  refId: Scalars['ObjectId']['output'];
  targetType: EPromotionTargetType;
  value: Scalars['Float']['output'];
};

export type AppointmentGetAvailableSlotsByDateInput = {
  categoryId: Scalars['ObjectId']['input'];
  date: Scalars['Date']['input'];
};

export type AppointmentModel = {
  __typename?: 'AppointmentModel';
  _id: Scalars['ObjectId']['output'];
  adminNote?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  customerId: Scalars['ObjectId']['output'];
  endDate: Scalars['Date']['output'];
  startDate: Scalars['Date']['output'];
  status: EAppointmentStatus;
  updatedAt: Scalars['Date']['output'];
  workerId?: Maybe<Scalars['ObjectId']['output']>;
};

export type AppointmentModelEdge = {
  __typename?: 'AppointmentModelEdge';
  cursor: Scalars['String']['output'];
  node: AppointmentModel;
};

export type AppointmentSearchQueryInput = {
  customerId?: InputMaybe<Scalars['ObjectId']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  workerId?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type AppointmentUpdateInput = {
  adminNote?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  workerId?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type BooleanFilterInput = {
  condition?: InputMaybe<EBooleanFilterCondition>;
  value: Scalars['Boolean']['input'];
};

export type CampaignCreateInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['Date']['input'];
  name: Scalars['String']['input'];
  partnerCode?: InputMaybe<Scalars['String']['input']>;
  redemptionAmountLimit?: InputMaybe<Scalars['Float']['input']>;
  redemptionCountLimit?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['Date']['input'];
  targets: Array<PromotionTargetInput>;
  type: ECampaignType;
};

export type CampaignDeleteInput = {
  isForce?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CampaignModel = {
  __typename?: 'CampaignModel';
  _id: Scalars['ObjectId']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  deactivatedAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['Date']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  partnerCode?: Maybe<Scalars['String']['output']>;
  redemptionAmountLimit?: Maybe<Scalars['Float']['output']>;
  redemptionCountLimit?: Maybe<Scalars['Int']['output']>;
  startDate: Scalars['Date']['output'];
  status?: Maybe<ECampaignStatus>;
  targets: Array<PromotionTargetModel>;
  type: ECampaignType;
  updatedAt: Scalars['Date']['output'];
  usedAmount: Scalars['Float']['output'];
  usedCount: Scalars['Int']['output'];
};

export type CampaignModelEdge = {
  __typename?: 'CampaignModelEdge';
  cursor: Scalars['String']['output'];
  node: CampaignModel;
};

export type CampaignSearchQueryInput = {
  isDeleted?: InputMaybe<BooleanFilterInput>;
};

export type CampaignUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  partnerCode?: InputMaybe<Scalars['String']['input']>;
  targets?: InputMaybe<Array<PromotionTargetInput>>;
};

export type CartItemInput = {
  id: Scalars['ObjectId']['input'];
  options?: InputMaybe<Array<CartItemOptionInput>>;
  quantity: Scalars['Int']['input'];
};

export type CartItemOptionInput = {
  id: Scalars['ObjectId']['input'];
  quantity: Scalars['Int']['input'];
};

export type CategoryCreateInput = {
  code: Scalars['String']['input'];
  description: Scalars['String']['input'];
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ObjectId']['input']>;
  schedule?: InputMaybe<CategoryScheduleInput>;
};

export type CategoryDeleteInput = {
  isForce?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CategoryModel = {
  __typename?: 'CategoryModel';
  _id: Scalars['ObjectId']['output'];
  ancestorIds: Array<Scalars['ObjectId']['output']>;
  code: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  deactivatedAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  imageUrls: Array<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['ObjectId']['output']>;
  schedule: CategoryScheduleModel;
  updatedAt: Scalars['Date']['output'];
};

export type CategoryModelEdge = {
  __typename?: 'CategoryModelEdge';
  cursor: Scalars['String']['output'];
  node: CategoryModel;
};

export type CategoryScheduleInput = {
  endTime: Scalars['Float']['input'];
  gap: Scalars['Float']['input'];
  startTime: Scalars['Float']['input'];
};

export type CategoryScheduleModel = {
  __typename?: 'CategoryScheduleModel';
  endTime: Scalars['Float']['output'];
  gap: Scalars['Float']['output'];
  startTime: Scalars['Float']['output'];
};

export type CategorySearchQueryInput = {
  isDeleted?: InputMaybe<BooleanFilterInput>;
};

export type CategoryUpdateInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ObjectId']['input']>;
  schedule?: InputMaybe<CategoryScheduleInput>;
};

export type CustomerCreateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminNote?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<EGender>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerDeleteInput = {
  isForce?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CustomerModel = {
  __typename?: 'CustomerModel';
  _id: Scalars['ObjectId']['output'];
  address?: Maybe<Scalars['String']['output']>;
  adminNote?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<EGender>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phoneCountryCode: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  ward?: Maybe<Scalars['String']['output']>;
};

export type CustomerModelEdge = {
  __typename?: 'CustomerModelEdge';
  cursor: Scalars['String']['output'];
  node: CustomerModel;
};

export type CustomerSearchQueryInput = {
  isDeleted?: InputMaybe<BooleanFilterInput>;
};

export type CustomerUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminNote?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<EGender>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export enum EAdminRoleType {
  Staff = 'STAFF'
}

export enum EAppointmentStatus {
  Cancelled = 'CANCELLED',
  Done = 'DONE',
  Rescheduled = 'RESCHEDULED',
  Scheduled = 'SCHEDULED'
}

export enum EBooleanFilterCondition {
  Equals = 'EQUALS',
  NotEquals = 'NOT_EQUALS'
}

export enum ECampaignStatus {
  Applicable = 'APPLICABLE',
  Deactivated = 'DEACTIVATED',
  NotApplicable = 'NOT_APPLICABLE',
  OverAmountLimit = 'OVER_AMOUNT_LIMIT',
  OverCountLimit = 'OVER_COUNT_LIMIT'
}

export enum ECampaignType {
  Bill = 'BILL',
  Category = 'CATEGORY',
  Code = 'CODE'
}

export enum EFileType {
  Gif = 'GIF',
  Jpeg = 'JPEG',
  Jpg = 'JPG',
  Png = 'PNG',
  Webp = 'WEBP'
}

export enum EGender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export enum EidFilterCondition {
  Equals = 'EQUALS',
  NotEquals = 'NOT_EQUALS'
}

export enum EJobStatus {
  Cancelled = 'CANCELLED',
  Contacted = 'CONTACTED',
  Done = 'DONE',
  InProcess = 'IN_PROCESS',
  Posted = 'POSTED',
  Rescheduled = 'RESCHEDULED'
}

export enum EPaymentMethod {
  Bank = 'BANK',
  Cash = 'CASH',
  Momo = 'MOMO'
}

export enum EPromotionTargetCondition {
  Any = 'ANY',
  Or = 'OR'
}

export enum EPromotionTargetType {
  Item = 'ITEM',
  Option = 'OPTION',
  Total = 'TOTAL'
}

export enum EPromotionType {
  Discount = 'DISCOUNT',
  Percent = 'PERCENT'
}

export enum ESortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum ETargetType {
  Category = 'CATEGORY',
  Customer = 'CUSTOMER',
  Item = 'ITEM',
  Job = 'JOB',
  Option = 'OPTION',
  Worker = 'WORKER'
}

export enum ETransactionStatus {
  Cancelled = 'CANCELLED',
  Done = 'DONE',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export enum EUserType {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER',
  Worker = 'WORKER'
}

export enum EWorkerRoleType {
  Collaborator = 'COLLABORATOR',
  SuperWorker = 'SUPER_WORKER'
}

export type FilePresignedUrlModel = {
  __typename?: 'FilePresignedUrlModel';
  cdnUrl: Scalars['String']['output'];
  fields: PresignedFieldModel;
  url: Scalars['String']['output'];
};

export type FileUploadInput = {
  isTemp?: InputMaybe<Scalars['Boolean']['input']>;
  target: ETargetType;
  type: EFileType;
};

export type IdFilterInput = {
  condition?: InputMaybe<EidFilterCondition>;
  value: Scalars['ObjectId']['input'];
};

export type ItemCreateInput = {
  categoryId: Scalars['ObjectId']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  estTime: Scalars['Int']['input'];
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  maxQuantity?: InputMaybe<Scalars['Int']['input']>;
  minQuantity: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  optionIds?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  price: Scalars['Float']['input'];
  subName?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ItemDeleteInput = {
  isForce?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ItemModel = {
  __typename?: 'ItemModel';
  _id: Scalars['ObjectId']['output'];
  category?: Maybe<CategoryModel>;
  categoryId: Scalars['ObjectId']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  deactivatedAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  estTime: Scalars['Int']['output'];
  imageUrls: Array<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  maxQuantity?: Maybe<Scalars['Int']['output']>;
  minQuantity: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  optionIds: Array<Scalars['ObjectId']['output']>;
  options?: Maybe<Array<OptionModel>>;
  orderCount: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  subName?: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
};

export type ItemModelEdge = {
  __typename?: 'ItemModelEdge';
  cursor: Scalars['String']['output'];
  node: ItemModel;
};

export type ItemSearchQueryInput = {
  categoryId?: InputMaybe<IdFilterInput>;
  isDeleted?: InputMaybe<BooleanFilterInput>;
};

export type ItemUpdateInput = {
  categoryId?: InputMaybe<Scalars['ObjectId']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  estTime?: InputMaybe<Scalars['Int']['input']>;
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxQuantity?: InputMaybe<Scalars['Int']['input']>;
  minQuantity?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionIds?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  price?: InputMaybe<Scalars['Float']['input']>;
  subName?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type JobAssignWorkerInput = {
  workerId: Scalars['ObjectId']['input'];
};

export type JobCreateInput = {
  address: Scalars['String']['input'];
  appliedCampaigns?: InputMaybe<Array<AppliedCampaignInput>>;
  categoryId: Scalars['ObjectId']['input'];
  customerId?: InputMaybe<Scalars['ObjectId']['input']>;
  customerName: Scalars['String']['input'];
  endDate: Scalars['Date']['input'];
  finalTotalPrice: Scalars['Float']['input'];
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  items: Array<JobItemInput>;
  metadata?: InputMaybe<JobMetadataInput>;
  note?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
  startDate: Scalars['Date']['input'];
  totalDiscountPrice?: InputMaybe<Scalars['Float']['input']>;
  totalPrice: Scalars['Float']['input'];
};

export type JobItemInput = {
  finalPrice: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<JobItemOptionInput>>;
  price: Scalars['Float']['input'];
  quantity: Scalars['Int']['input'];
  refId: Scalars['ObjectId']['input'];
};

export type JobItemModel = {
  __typename?: 'JobItemModel';
  finalPrice: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  options?: Maybe<Array<JobItemOptionModel>>;
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  refId: Scalars['ObjectId']['output'];
};

export type JobItemOptionInput = {
  finalPrice: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  quantity: Scalars['Int']['input'];
  refId: Scalars['ObjectId']['input'];
};

export type JobItemOptionModel = {
  __typename?: 'JobItemOptionModel';
  finalPrice: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  refId: Scalars['ObjectId']['output'];
};

export type JobItemsUpdateInput = {
  appliedCampaigns?: InputMaybe<Array<AppliedCampaignInput>>;
  finalTotalPrice: Scalars['Float']['input'];
  items: Array<JobItemInput>;
  totalDiscountPrice?: InputMaybe<Scalars['Float']['input']>;
  totalEstTime: Scalars['Int']['input'];
  totalPrice: Scalars['Float']['input'];
};

export type JobMetadataInput = {
  referralName?: InputMaybe<Scalars['String']['input']>;
  utmCampaign?: InputMaybe<Scalars['String']['input']>;
  utmMedium?: InputMaybe<Scalars['String']['input']>;
  utmSource?: InputMaybe<Scalars['String']['input']>;
};

export type JobMetadataModel = {
  __typename?: 'JobMetadataModel';
  utmCampaign?: Maybe<Scalars['String']['output']>;
  utmMedium?: Maybe<Scalars['String']['output']>;
  utmSource?: Maybe<Scalars['String']['output']>;
};

export type JobModel = {
  __typename?: 'JobModel';
  _id: Scalars['ObjectId']['output'];
  address: Scalars['String']['output'];
  adminNote?: Maybe<Scalars['String']['output']>;
  appliedCampaigns?: Maybe<Array<AppliedCampaignModel>>;
  appointmentId: Scalars['ObjectId']['output'];
  cancelledAt?: Maybe<Scalars['Date']['output']>;
  category?: Maybe<CategoryModel>;
  categoryId: Scalars['ObjectId']['output'];
  contactedAt?: Maybe<Scalars['Date']['output']>;
  createdAt: Scalars['Date']['output'];
  csId: Scalars['String']['output'];
  customerId: Scalars['ObjectId']['output'];
  customerName: Scalars['String']['output'];
  doneAt?: Maybe<Scalars['Date']['output']>;
  endDate: Scalars['Date']['output'];
  finalTotalPrice: Scalars['Float']['output'];
  imageUrls: Array<Scalars['String']['output']>;
  inProgressAt?: Maybe<Scalars['Date']['output']>;
  items: Array<JobItemModel>;
  metadata?: Maybe<JobMetadataModel>;
  note?: Maybe<Scalars['String']['output']>;
  phoneNumber: Scalars['String']['output'];
  rescheduledAt?: Maybe<Scalars['Date']['output']>;
  startDate: Scalars['Date']['output'];
  status: EJobStatus;
  totalDiscountPrice: Scalars['Float']['output'];
  totalPrice: Scalars['Float']['output'];
  transaction?: Maybe<TransactionModel>;
  transactionId: Scalars['ObjectId']['output'];
  updatedAt: Scalars['Date']['output'];
  workImageUrls: Array<Scalars['String']['output']>;
  workerId?: Maybe<Scalars['ObjectId']['output']>;
};

export type JobModelEdge = {
  __typename?: 'JobModelEdge';
  cursor: Scalars['String']['output'];
  node: JobModel;
};

export type JobSearchQueryInput = {
  categoryId?: InputMaybe<IdFilterInput>;
  isDeleted?: InputMaybe<BooleanFilterInput>;
};

export type JobUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminNote?: InputMaybe<Scalars['String']['input']>;
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  workImageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type JobUpdateStatusInput = {
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status: EJobStatus;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignJobWorkerById: JobModel;
  createAdmin: AdminModel;
  createCampaign: CampaignModel;
  createCategory: CategoryModel;
  createCustomer: CustomerModel;
  createItem: ItemModel;
  createJob: JobModel;
  createOption: OptionModel;
  createWorker: WorkerModel;
  deleteAdminById: SuccessRes;
  deleteCampaignById: SuccessRes;
  deleteCategoryById: SuccessRes;
  deleteCustomerById: SuccessRes;
  deleteItemById: SuccessRes;
  deleteOptionById: SuccessRes;
  deleteWorkerById: SuccessRes;
  logout: SuccessRes;
  phoneLogin: SuccessRes;
  preBookingJob: PreBookingJobModel;
  regenerateRefreshToken: UserTokensModel;
  updateAdminById: AdminModel;
  updateAppointmentById: AppointmentModel;
  updateCampaignById: CampaignModel;
  updateCategoryById: CategoryModel;
  updateCustomerById: CustomerModel;
  updateItemById: ItemModel;
  updateJobById: JobModel;
  updateJobItemsById: JobModel;
  updateJobStatusById: JobModel;
  updateOptionById: OptionModel;
  updateTransactionById: TransactionModel;
  updateWorkerById: WorkerModel;
  uploadImage?: Maybe<FilePresignedUrlModel>;
  verifyOtpCode: UserLoginModel;
};


export type MutationAssignJobWorkerByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: JobAssignWorkerInput;
};


export type MutationCreateAdminArgs = {
  input: AdminCreateInput;
};


export type MutationCreateCampaignArgs = {
  input: CampaignCreateInput;
};


export type MutationCreateCategoryArgs = {
  input: CategoryCreateInput;
};


export type MutationCreateCustomerArgs = {
  input: CustomerCreateInput;
};


export type MutationCreateItemArgs = {
  input: ItemCreateInput;
};


export type MutationCreateJobArgs = {
  input: JobCreateInput;
};


export type MutationCreateOptionArgs = {
  input: OptionCreateInput;
};


export type MutationCreateWorkerArgs = {
  input: WorkerCreateInput;
};


export type MutationDeleteAdminByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input?: InputMaybe<AdminDeleteInput>;
};


export type MutationDeleteCampaignByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input?: InputMaybe<CampaignDeleteInput>;
};


export type MutationDeleteCategoryByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input?: InputMaybe<CategoryDeleteInput>;
};


export type MutationDeleteCustomerByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input?: InputMaybe<CustomerDeleteInput>;
};


export type MutationDeleteItemByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input?: InputMaybe<ItemDeleteInput>;
};


export type MutationDeleteOptionByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input?: InputMaybe<OptionDeleteInput>;
};


export type MutationDeleteWorkerByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input?: InputMaybe<WorkerDeleteInput>;
};


export type MutationLogoutArgs = {
  input: UserLogoutInput;
};


export type MutationPhoneLoginArgs = {
  input: UserPhoneLoginInput;
};


export type MutationPreBookingJobArgs = {
  input: PreBookingJobInput;
};


export type MutationRegenerateRefreshTokenArgs = {
  input: UserRegenerateRefreshTokenInput;
};


export type MutationUpdateAdminByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: AdminUpdateInput;
};


export type MutationUpdateAppointmentByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: AppointmentUpdateInput;
};


export type MutationUpdateCampaignByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: CampaignUpdateInput;
};


export type MutationUpdateCategoryByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: CategoryUpdateInput;
};


export type MutationUpdateCustomerByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: CustomerUpdateInput;
};


export type MutationUpdateItemByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: ItemUpdateInput;
};


export type MutationUpdateJobByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: JobUpdateInput;
};


export type MutationUpdateJobItemsByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: JobItemsUpdateInput;
};


export type MutationUpdateJobStatusByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: JobUpdateStatusInput;
};


export type MutationUpdateOptionByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: OptionUpdateInput;
};


export type MutationUpdateTransactionByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: TransactionUpdateInput;
};


export type MutationUpdateWorkerByIdArgs = {
  id: Scalars['ObjectId']['input'];
  input: WorkerUpdateInput;
};


export type MutationUploadImageArgs = {
  input: FileUploadInput;
};


export type MutationVerifyOtpCodeArgs = {
  input: UserVerifyPhoneOtpInput;
};

export type OffsetPaginatedAdmins = {
  __typename?: 'OffsetPaginatedAdmins';
  nodes: Array<AdminModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedAppointments = {
  __typename?: 'OffsetPaginatedAppointments';
  nodes: Array<AppointmentModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedCampaigns = {
  __typename?: 'OffsetPaginatedCampaigns';
  nodes: Array<CampaignModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedCategories = {
  __typename?: 'OffsetPaginatedCategories';
  nodes: Array<CategoryModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedCustomers = {
  __typename?: 'OffsetPaginatedCustomers';
  nodes: Array<CustomerModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedItems = {
  __typename?: 'OffsetPaginatedItems';
  nodes: Array<ItemModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedJobs = {
  __typename?: 'OffsetPaginatedJobs';
  nodes: Array<JobModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedOptions = {
  __typename?: 'OffsetPaginatedOptions';
  nodes: Array<OptionModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedTransactions = {
  __typename?: 'OffsetPaginatedTransactions';
  nodes: Array<TransactionModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginatedWorkers = {
  __typename?: 'OffsetPaginatedWorkers';
  nodes: Array<WorkerModel>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type OffsetPaginationInput = {
  limit?: Scalars['Int']['input'];
  pageNumber?: Scalars['Int']['input'];
  sortOrder?: ESortOrder;
};

export type OffsetPaginationOptionInput = {
  isGetAll?: InputMaybe<Scalars['Boolean']['input']>;
};

export type OptionCreateInput = {
  categoryId: Scalars['ObjectId']['input'];
  estTime: Scalars['Int']['input'];
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  maxQuantity?: InputMaybe<Scalars['Int']['input']>;
  minQuantity: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type OptionDeleteInput = {
  isForce?: InputMaybe<Scalars['Boolean']['input']>;
};

export type OptionModel = {
  __typename?: 'OptionModel';
  _id: Scalars['ObjectId']['output'];
  category?: Maybe<CategoryModel>;
  categoryId: Scalars['ObjectId']['output'];
  createdAt: Scalars['Date']['output'];
  deactivatedAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  estTime: Scalars['Int']['output'];
  imageUrls: Array<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  maxQuantity?: Maybe<Scalars['Int']['output']>;
  minQuantity: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  orderCount: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  tags: Array<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
};

export type OptionModelEdge = {
  __typename?: 'OptionModelEdge';
  cursor: Scalars['String']['output'];
  node: OptionModel;
};

export type OptionSearchQueryInput = {
  categoryId?: InputMaybe<IdFilterInput>;
  isDeleted?: InputMaybe<BooleanFilterInput>;
};

export type OptionUpdateInput = {
  categoryId?: InputMaybe<Scalars['ObjectId']['input']>;
  estTime?: InputMaybe<Scalars['Int']['input']>;
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxQuantity?: InputMaybe<Scalars['Int']['input']>;
  minQuantity?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type PaginatedAdmins = {
  __typename?: 'PaginatedAdmins';
  edges: Array<AdminModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedAppointments = {
  __typename?: 'PaginatedAppointments';
  edges: Array<AppointmentModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedCampaigns = {
  __typename?: 'PaginatedCampaigns';
  edges: Array<CampaignModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedCategories = {
  __typename?: 'PaginatedCategories';
  edges: Array<CategoryModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedCustomers = {
  __typename?: 'PaginatedCustomers';
  edges: Array<CustomerModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedItems = {
  __typename?: 'PaginatedItems';
  edges: Array<ItemModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedJobs = {
  __typename?: 'PaginatedJobs';
  edges: Array<JobModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedOptions = {
  __typename?: 'PaginatedOptions';
  edges: Array<OptionModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedTransactions = {
  __typename?: 'PaginatedTransactions';
  edges: Array<TransactionModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedWorkers = {
  __typename?: 'PaginatedWorkers';
  edges: Array<WorkerModelEdge>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  sortOrder?: ESortOrder;
};

export type PreBookingJobInput = {
  campaignCode?: InputMaybe<Scalars['String']['input']>;
  categoryId: Scalars['ObjectId']['input'];
  items: Array<CartItemInput>;
};

export type PreBookingJobModel = {
  __typename?: 'PreBookingJobModel';
  appliedCampaigns?: Maybe<Array<AppliedCampaignModel>>;
  finalTotalPrice: Scalars['Float']['output'];
  items: Array<JobItemModel>;
  totalDiscountPrice: Scalars['Float']['output'];
  totalEstTime: Scalars['Int']['output'];
  totalPrice: Scalars['Float']['output'];
};

export type PresignedFieldModel = {
  __typename?: 'PresignedFieldModel';
  acl: Scalars['String']['output'];
  algorithm: Scalars['String']['output'];
  bucket: Scalars['String']['output'];
  contentType: Scalars['String']['output'];
  credential: Scalars['String']['output'];
  date: Scalars['String']['output'];
  key: Scalars['String']['output'];
  policy: Scalars['String']['output'];
  signature: Scalars['String']['output'];
};

export type PromotionTargetInput = {
  condition?: InputMaybe<EPromotionTargetCondition>;
  ids: Array<Scalars['ObjectId']['input']>;
  promotionType: EPromotionType;
  type: EPromotionTargetType;
  value: Scalars['Float']['input'];
};

export type PromotionTargetModel = {
  __typename?: 'PromotionTargetModel';
  condition: EPromotionTargetCondition;
  ids: Array<Scalars['ObjectId']['output']>;
  promotionType: EPromotionType;
  type: EPromotionTargetType;
  value: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  adminSearch: OffsetPaginatedAdmins;
  appointmentSearch: OffsetPaginatedAppointments;
  campaignSearch: OffsetPaginatedCampaigns;
  categorySearch: OffsetPaginatedCategories;
  customerSearch: OffsetPaginatedCustomers;
  findAdminById: AdminModel;
  findAppointmentById: AppointmentModel;
  findCampaignById: CampaignModel;
  findCategoryById: CategoryModel;
  findCustomerById: CustomerModel;
  findItemById: ItemModel;
  findJobById: JobModel;
  findOptionById: OptionModel;
  findTransactionById: TransactionModel;
  findWorkerById: WorkerModel;
  getAppointmentAvailableSlots: Array<Scalars['Int']['output']>;
  itemSearch: OffsetPaginatedItems;
  jobSearch: OffsetPaginatedJobs;
  lazyAdminSearch: PaginatedAdmins;
  lazyAppointmentSearch: PaginatedAppointments;
  lazyCampaignSearch: PaginatedCampaigns;
  lazyCategorySearch: PaginatedCategories;
  lazyCustomerSearch: PaginatedCustomers;
  lazyItemSearch: PaginatedItems;
  lazyJobSearch: PaginatedJobs;
  lazyOptionSearch: PaginatedOptions;
  lazyTransactionSearch: PaginatedTransactions;
  lazyWorkerSearch: PaginatedWorkers;
  optionSearch: OffsetPaginatedOptions;
  transactionSearch: OffsetPaginatedTransactions;
  workerSearch: OffsetPaginatedWorkers;
};


export type QueryAdminSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<AdminSearchQueryInput>;
};


export type QueryAppointmentSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<AppointmentSearchQueryInput>;
};


export type QueryCampaignSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<CampaignSearchQueryInput>;
};


export type QueryCategorySearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<CategorySearchQueryInput>;
};


export type QueryCustomerSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<CustomerSearchQueryInput>;
};


export type QueryFindAdminByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindAppointmentByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindCampaignByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindCategoryByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindCustomerByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindItemByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindJobByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindOptionByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindTransactionByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryFindWorkerByIdArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryGetAppointmentAvailableSlotsArgs = {
  input: AppointmentGetAvailableSlotsByDateInput;
};


export type QueryItemSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<ItemSearchQueryInput>;
};


export type QueryJobSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<JobSearchQueryInput>;
};


export type QueryLazyAdminSearchArgs = {
  input: PaginationInput;
};


export type QueryLazyAppointmentSearchArgs = {
  input: PaginationInput;
};


export type QueryLazyCampaignSearchArgs = {
  input: PaginationInput;
};


export type QueryLazyCategorySearchArgs = {
  input: PaginationInput;
};


export type QueryLazyCustomerSearchArgs = {
  input: PaginationInput;
};


export type QueryLazyItemSearchArgs = {
  input: PaginationInput;
};


export type QueryLazyJobSearchArgs = {
  input: PaginationInput;
};


export type QueryLazyOptionSearchArgs = {
  input: PaginationInput;
};


export type QueryLazyTransactionSearchArgs = {
  input: PaginationInput;
};


export type QueryLazyWorkerSearchArgs = {
  input: PaginationInput;
};


export type QueryOptionSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<OptionSearchQueryInput>;
};


export type QueryTransactionSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<TransactionSearchQueryInput>;
};


export type QueryWorkerSearchArgs = {
  optionInput?: InputMaybe<OffsetPaginationOptionInput>;
  paginationInput: OffsetPaginationInput;
  queryInput?: InputMaybe<WorkerSearchQueryInput>;
};

export type SuccessRes = {
  __typename?: 'SuccessRes';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type TransactionModel = {
  __typename?: 'TransactionModel';
  _id: Scalars['ObjectId']['output'];
  amount: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  note?: Maybe<Scalars['String']['output']>;
  paymentMethod: EPaymentMethod;
  status: ETransactionStatus;
  updatedAt: Scalars['Date']['output'];
  userId: Scalars['ObjectId']['output'];
};

export type TransactionModelEdge = {
  __typename?: 'TransactionModelEdge';
  cursor: Scalars['String']['output'];
  node: TransactionModel;
};

export type TransactionSearchQueryInput = {
  userId?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type TransactionUpdateInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<EPaymentMethod>;
  status?: InputMaybe<ETransactionStatus>;
};

export type UserInfoModel = {
  __typename?: 'UserInfoModel';
  _id: Scalars['ObjectId']['output'];
  type: EUserType;
};

export type UserLoginModel = {
  __typename?: 'UserLoginModel';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  userInfo: UserInfoModel;
};

export type UserLogoutInput = {
  refreshToken: Scalars['String']['input'];
};

export type UserPhoneLoginInput = {
  phoneNumber: Scalars['String']['input'];
  type: EUserType;
};

export type UserRegenerateRefreshTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type UserTokensModel = {
  __typename?: 'UserTokensModel';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type UserVerifyPhoneOtpInput = {
  code: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  type: EUserType;
};

export type WorkerCreateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminNote?: InputMaybe<Scalars['String']['input']>;
  categoryId: Scalars['ObjectId']['input'];
  city?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<EGender>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
  role?: InputMaybe<EWorkerRoleType>;
  schedule?: InputMaybe<WorkerScheduleInput>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type WorkerDeleteInput = {
  isForce?: InputMaybe<Scalars['Boolean']['input']>;
};

export type WorkerModel = {
  __typename?: 'WorkerModel';
  _id: Scalars['ObjectId']['output'];
  address?: Maybe<Scalars['String']['output']>;
  adminNote?: Maybe<Scalars['String']['output']>;
  categoryId: Scalars['ObjectId']['output'];
  city?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  deactivatedAt?: Maybe<Scalars['Date']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<EGender>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isAvailable: Scalars['Boolean']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phoneCountryCode: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  role: EWorkerRoleType;
  schedule: WorkerScheduleModel;
  updatedAt: Scalars['Date']['output'];
  ward?: Maybe<Scalars['String']['output']>;
};

export type WorkerModelEdge = {
  __typename?: 'WorkerModelEdge';
  cursor: Scalars['String']['output'];
  node: WorkerModel;
};

export type WorkerScheduleInput = {
  FRIDAY: WorkerTimeSlotInput;
  MONDAY: WorkerTimeSlotInput;
  SATURDAY: WorkerTimeSlotInput;
  SUNDAY: WorkerTimeSlotInput;
  THURSDAY: WorkerTimeSlotInput;
  TUESDAY: WorkerTimeSlotInput;
  WEDNESDAY: WorkerTimeSlotInput;
};

export type WorkerScheduleModel = {
  __typename?: 'WorkerScheduleModel';
  FRIDAY: Array<WorkerTimeSlotModel>;
  MONDAY: Array<WorkerTimeSlotModel>;
  SATURDAY: Array<WorkerTimeSlotModel>;
  SUNDAY: Array<WorkerTimeSlotModel>;
  THURSDAY: Array<WorkerTimeSlotModel>;
  TUESDAY: Array<WorkerTimeSlotModel>;
  WEDNESDAY: Array<WorkerTimeSlotModel>;
};

export type WorkerSearchQueryInput = {
  isDeleted?: InputMaybe<BooleanFilterInput>;
};

export type WorkerTimeSlotInput = {
  endTime: Scalars['Int']['input'];
  isActive: Scalars['Boolean']['input'];
  startTime: Scalars['Int']['input'];
};

export type WorkerTimeSlotModel = {
  __typename?: 'WorkerTimeSlotModel';
  endTime: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  startTime: Scalars['Int']['output'];
};

export type WorkerUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  adminNote?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ObjectId']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<EGender>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<EWorkerRoleType>;
  schedule?: InputMaybe<WorkerScheduleInput>;
  ward?: InputMaybe<Scalars['String']['input']>;
};
