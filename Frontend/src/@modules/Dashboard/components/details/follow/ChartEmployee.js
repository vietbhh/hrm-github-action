// ** React Imports
// ** Styles
// ** Components
import { useFormatMessage } from "@apps/utility/common";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ChartEmployee = (props) => {
  const {
    // ** props
    listEmployee,
    onboardingData,
    offboardingData
    // ** methods
  } = props;

  const totalEmployee = listEmployee.length;
  const data = [
    {
      name: useFormatMessage("modules.checklist.title.onboarding"),
      value: 40,
      color: "#ffe700",
      key: "onboading",
      total: 0
    },
    {
      name: useFormatMessage("modules.checklist.title.offboarding"),
      value: 40,
      color: "#00d4bd",
      key: "offboading",
      total: 0
    },
    {
      name: useFormatMessage("modules.checklist.title.other"),
      value: 20,
      color: "#826bf8",
      key: "other",
      total: 0
    }
  ];

  listEmployee.map((item) => {
    if (onboardingData.some((e) => e.employee_id.value === item.id)) {
      data[0]["total"] += 1;
    } else if (offboardingData.some((e) => e.employee_id.value === item.id)) {
      data[1]["total"] += 1;
    } else {
      data[2]["total"] += 1;
    }
  });

  data[0]["value"] = (data[0]["total"] / totalEmployee) * 100;
  data[1]["value"] = (data[1]["total"] / totalEmployee) * 100;
  data[2]["value"] = (data[2]["total"] / totalEmployee) * 100;

  /*eslint-disable */
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    fill
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    /*eslint-enable */
    return (
      <text
        x={x}
        y={y}
        fill={fill === props.secondary ? "#000" : "#fff"}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="mb-1">
      <div className="recharts-wrapper" style={{ height: "250px" }}>
        <ResponsiveContainer>
          <PieChart height={250}>
            <Pie
              data={data}
              innerRadius={55}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} label />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="d-flex align-items-center justify-content-center flex-wrap">
        <div className="me-2">
          <span
            className="bullet bullet-sm bullet-bordered me-50"
            style={{ backgroundColor: "#ffe700" }}
          ></span>
          <span className="align-middle me-75">
            {useFormatMessage("modules.checklist.title.onboarding")}
          </span>
        </div>
        <div className="me-2">
          <span
            className="bullet bullet-sm bullet-bordered me-50"
            style={{ backgroundColor: "#00d4bd" }}
          ></span>
          <span className="align-middle me-75">
            {useFormatMessage("modules.checklist.title.offboarding")}
          </span>
        </div>
        <div>
          <span
            className="bullet bullet-sm bullet-bordered me-50"
            style={{ backgroundColor: "#826bf8" }}
          ></span>
          <span className="align-middle me-75">
            {useFormatMessage("modules.checklist.title.other")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartEmployee;
