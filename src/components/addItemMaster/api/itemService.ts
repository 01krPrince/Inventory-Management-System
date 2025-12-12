import { ItemFormData, ItemResponse } from "../models/ItemModel";
import api from "../../../services/api";
import { toNull } from "./helpers";

const BASE_URL = "/item_master";

const transformPayload = (formData: ItemFormData) => ({
  item_mode: toNull(formData.itemMode),
  name: toNull(formData.item_name),
  under_group: toNull(formData.underGroup),
  stock_unit: toNull(formData.stockUnit),
  gst_classfication: toNull(formData.gstClassification),

  category: toNull(formData.category),
  brand: toNull(formData.brand),
  type: toNull(formData.type),
  unit_option: toNull(formData.unitOption),
  barcode: toNull(formData.barCode),
  auto_barcode: toNull(formData.autoBarcodePrefix),

  gst_applicable: !formData.gstInputNotApplicable,
  print_barcode: !!formData.printBarcode,

  sale_desc: toNull(formData.salesDescription),
  sales_gl: toNull(formData.salesGL),
  mrp: toNull(formData.mrp),
  minimum_price: toNull(formData.minPrice),
  sales_rate: toNull(formData.salesRate),
  wholesale_rate: toNull(formData.wholesaleRate),
  dealer_factor: toNull(formData.dealerRate),
  rate_factor: toNull(formData.rateFactor),
  sale_discount: toNull(formData.salesDiscount),
  sale_discount_percent: toNull(formData.salesDiscountPercent),

  purch_desc: toNull(formData.purchaseDescription),
  purchase_gl: toNull(formData.purchaseGL),
  purchase_rate: toNull(formData.purchaseRate),
  purchase_ratefactor: toNull(formData.purchaseRateFactor),
  purchase_discount: toNull(formData.purchaseDiscount1),
  purchase_discount_percent: toNull(formData.purchaseDiscount2),

  item_workflow: toNull(formData.itemWorkflow),
  procurement_type: toNull(formData.procurementType),
  minimum_level: toNull(formData.minLevel),
  maximum_level: toNull(formData.maxLevel),
  weighscale_mapping_code: toNull(formData.weighscaleMappingCode),
  rackbin_no: toNull(formData.rackBinNo),
  add_in_item_set_template: toNull(formData.itemSetTemplate),

  batch_wise_inventory: !!formData.batchWiseInventory,
  batch_wise_rate: !!formData.batchWiseRate,
  drug_type: toNull(formData.drugType),
  salt: toNull(formData.salt),

  skip_item_from_loyalty: formData.skipLoyaltyPoints ? "Yes" : "No",
  exclude_cvss_applist: !!formData.excludeInCvss,
  ask_udf_in_document: formData.askUdfInDocument ? "Y" : "N",

  attachment: toNull(formData.profileImage),
});

export const createItem = async (formData: ItemFormData): Promise<ItemResponse> => {
  const payload = transformPayload(formData);

  const response = await api.post(`${BASE_URL}/create_item`, payload);
  return response.data;
};

export const updateItem = async (
  id: string,
  formData: ItemFormData
): Promise<ItemResponse> => {
  const payload = transformPayload(formData);

  const response = await api.put(`${BASE_URL}/update_item/${id}`, payload);
  return response.data;
};
