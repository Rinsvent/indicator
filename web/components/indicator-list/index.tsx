import * as React from 'react';
import Box from '@mui/material/Box';
import {Indicator as IndicatorDB} from "@/db/models";
import Indicator from "@/components/indicator";

type IndicatorListType = {
    items: IndicatorDB[]
}

export default function IndicatorList(data: IndicatorListType) {
  return (
      <Box>
          {data.items.map((indicator, key) => {
              return (
                  <Indicator key={key} {...indicator} />
              )
          })}
      </Box>
  );
}
