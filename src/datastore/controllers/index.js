import { ipcMain } from "electron";
import eventConst from "@/eventConst";
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
ipcMain.handle(eventConst.GET_WAREHOUSE, () => warehouse.Get());
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

//category handle here
ipcMain.handle(eventConst.GET_CATAGORY, commodity.GetCategory);
ipcMain.handle(eventConst.CREATE_CATAGORY, (event, rb) => {
  return commodity.CreateCategory(rb);
});

//item handle here
ipcMain.handle(eventConst.GET_COMMODITY, commodity.GetCommodity);
ipcMain.handle(eventConst.CREATE_COMMODITY, (event, rb) => {
  return commodity.CreateCommodity(rb);
});

//inward handle here
ipcMain.handle(eventConst.GET_INWARD, (event, rb) => {
  return inward.GetInwardList(rb);
});
ipcMain.handle(eventConst.CREATE_INWARD, (event, rb) => {
  return inward.CreateInward(rb);
});
ipcMain.handle(eventConst.GET_INWARD_BY_ID, (event, rb) => {
  return inward.GetInById(rb);
});
ipcMain.handle(eventConst.GET_INWARD_BY_BALANCE, () =>
  inward.GetInwardByBalance()
);
ipcMain.handle(eventConst.GET_INWARD_BY_DATE, (event, rb) =>
  inward.GetReportByDate(rb)
);
ipcMain.handle(eventConst.GET_INWARD_BY_RACK, (event, rb)=>{
  return inward.GetInwardByRack(rb)
})

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
