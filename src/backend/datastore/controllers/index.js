import { ipcMain } from "electron";
import eventConst from "@/shared/eventConst";
import warehouse from "./Warehouse.controller";
import rack from "./Rack.controller";
import floor from "./Floor.controller";
import chamber from "./Chamber.controller";
import customer from "./Customer.controller";
import commodity from "./Commodity.controller";
import inward from "./Inward.controller";
import stock from "./Stock.controller";
import outward from "./Outward.controller";

//warehouse handles
ipcMain.handle(eventConst.GET_WAREHOUSE, (event, rb) => warehouse.Get(rb));
ipcMain.handle(eventConst.CREATE_WAREHOUSE, (event, rb) => {
  return warehouse.Post(rb);
});
ipcMain.handle(eventConst.UPDATE_WAREHOUSE, (event, rb) => {
  return warehouse.Update(rb);
});
ipcMain.handle(eventConst.DELETE_WAREHOUSE, (event, rb) => {
  return warehouse.DeleteWarehouse(rb);
});

//chamber handle
ipcMain.handle(eventConst.GET_CHAMBER, (event, rb) => {
  return chamber.Get(rb);
});
ipcMain.handle(eventConst.CREATE_CHAMBER, (event, rb) => {
  return chamber.Post(rb);
});

// floor handle
ipcMain.handle(eventConst.GET_FLOOR, (event, rb) => {
  return floor.Get(rb);
});
ipcMain.handle(eventConst.CREATE_FLOOR, (event, rb) => {
  return floor.Post(rb);
});

//rack handle here
ipcMain.handle(eventConst.GET_RACK, (event, rb) => {
  return rack.Get(rb);
});
ipcMain.handle(eventConst.CREATE_RACK, (event, rb) => {
  return rack.Post(rb);
});

//customer handle here
ipcMain.handle(eventConst.GET_CUSTOMER, (event, rb) => {
  return customer.Get(rb);
});
ipcMain.handle(eventConst.CREATE_CUSTOMER, (event, rb) => {
  return customer.Post(rb);
});

ipcMain.handle(eventConst.GET_CUSTOMER_COUNT, () => {
  return customer.getTotalCustomerCount();
});
ipcMain.handle(eventConst.DELETE_CUSTOMER, (event, id) =>
  customer.DeleteById(id)
);
ipcMain.handle(eventConst.EDIT_CUSTOMER, (event, id) =>
  customer.EditCustomer(id)
);

//category handle here
ipcMain.handle(eventConst.GET_CATAGORY, () => {
  return commodity.GetCategory();
});
ipcMain.handle(eventConst.CREATE_CATAGORY, (event, rb) => {
  return commodity.CreateCategory(rb);
});
ipcMain.handle(eventConst.EDIT_CATEGORY, (event, rb) => {
  return commodity.EditCategory(rb);
});

//item handle here
ipcMain.handle(eventConst.GET_COMMODITY, () => commodity.GetCommodity());
ipcMain.handle(eventConst.CREATE_COMMODITY, (event, rb) => {
  return commodity.CreateCommodity(rb);
});
ipcMain.handle(eventConst.EDIT_COMMODITY, (event, rb) => {
  return commodity.EditCommodity(rb);
});

//inward handle here
ipcMain.handle(eventConst.GET_INWARD, (event, rb) => {
  return inward.GetInwardList(rb);
});
ipcMain.handle(eventConst.CREATE_INWARD, (event, rb) => {
  return inward.CreateInward(rb);
});
ipcMain.handle(eventConst.DELETE_INWARD, (event, rb) => {
  return inward.DeleteById(rb);
});
ipcMain.handle(eventConst.GET_INWARD_BY_ID, (event, rb) => {
  return inward.GetInById(rb);
});
ipcMain.handle(eventConst.GET_INWARD_BY_BALANCE, () =>
  inward.GetCustomerListByBalance()
);
ipcMain.handle(eventConst.GET_INWARD_BY_DATE, (event, rb) =>
  inward.GetReportByDate(rb)
);
ipcMain.handle(eventConst.GET_INWARD_BY_RACK, (event, rb) => {
  return inward.GetInwardByRack(rb);
});
ipcMain.handle(eventConst.GET_INWARD_BY_COMMODITY, (event, rb) => {
  return inward.GetInwardsByCommodity(rb);
});
ipcMain.handle(eventConst.UPDATE_LOCATION, (event, rb) => {
  return inward.UpdateLocation(rb);
});
ipcMain.handle(eventConst.UNLOADED_INWARDS, () => inward.getUnloadedInwards());
ipcMain.handle(eventConst.UNLOADED_INWARDS_STOCKS, () => inward.getUnloadedStock());

//stock
ipcMain.handle(eventConst.GET_TOTAL_STOCK, () => {
  return stock.getTotalStock();
});

//Outward
ipcMain.handle(eventConst.CREATE_OUTWARD, (event, rb) => {
  return outward.Create(rb);
});
ipcMain.handle(eventConst.GET_OUTWARD_BY_DATE, (event, rb) => {
  return outward.GetReportByDate(rb);
});
ipcMain.handle(eventConst.DELETE_OUTWARD_BY_ID, (event, rb) => {
  return outward.DeleteById(rb);
});

//Outward
ipcMain.handle(eventConst.CREATE_VARIANT, (event, rb) => {
  return commodity.CreateVariant(rb);
});
ipcMain.handle(eventConst.GET_VARIANT, (event, rb) => {
  return commodity.GetVariant(rb);
});
ipcMain.handle(eventConst.EDIT_VARIANT, (event, rb) => {
  return commodity.EditVariant(rb);
});
ipcMain.handle(eventConst.GET_COMMODITY_STOCK, (event, rb) => {
  return stock.getCommodityStocks(rb);
});
