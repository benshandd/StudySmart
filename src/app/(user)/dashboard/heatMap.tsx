"use client";
import React from "react";
import Tooltip from "@uiw/react-tooltip";
import HeatMap from "@uiw/react-heat-map";
import { convertDateToString } from "@/lib/utils";

type Props = {
  data: {
    createdAt: Date;
    count: number;
  }[];
};

const panelColours = {
  0: "#4b515c",
  8: "#7BC96F",
  4: "#C6E48B",
  12: "#239A3B",
  32: "#196127",
};

const SubmissionsHeatMap = (props: Props) => {
  const dateCountMap = props.data.reduce((acc, item) => {
    const date = convertDateToString(item.createdAt);
    if (acc[date]) {
      acc[date] += item.count;
    } else {
      acc[date] = item.count;
    }
    return acc;
  }, {} as Record<string, number>);

  const formattedDates = Object.keys(dateCountMap).map((date) => ({
    date,
    count: dateCountMap[date],
  }));

  //console.log(formattedDates);

  return (
    <HeatMap
      value={formattedDates}
      width="100%"
      style={{ color: "#888" }}
      panelColors={panelColours}
      startDate={new Date("2024/08/01")}
      rectRender={(props, data) => {
        return (
          <Tooltip placement="top" content={`count: ${data.count || 0}`}>
            <rect {...props} />
          </Tooltip>
        );
      }}
    />
  );
};

export default SubmissionsHeatMap;
