const { init } = require("./chart");
const { default: OrgChart } = require("./react/org-chart");
OrgChart.init = init;

export default OrgChart;
