import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Indicator from "@/components/indicator";

type IndicatorListType = {
    level: string
}

export default function IndicatorList() {
  return (
      <Box>
          <Indicator code={'phpstan'} level={'critical'} text={''} />
          <Indicator code={'rectorktfkutdktgd yydkyt ktd'} level={'error'} text={'need fix'} />
          <Indicator code={'tests'} level={'warning'} text={'That`s bad'} />
          <Indicator code={'tests2'} level={'warning'} text={'That`s bad'} />
          <Indicator code={'dj'} level={'success'} text={'It`s well'} />
          <Indicator code={'dj2'} level={'success'} text={'It`s well'} />
          <Indicator code={'dj2'} level={'success'} text={'It`s well'} />
          <Indicator code={'dj2'} level={'success'} text={'It`s well'} />
          <Indicator code={'dj2'} level={'success'} text={'It`s well'} />
          <Indicator code={'dj2'} level={'success'} text={'It`s well'} />
          <Indicator code={'dj2'} level={'success'} text={'It`s well'} />
          <Indicator code={'dj2'} level={'success'} text={'It`s well'} />
          <Indicator code={'dj2'} level={'success'} text={'It`s well'} />
          <Indicator code={'djjhyfkt fk gkhgcfjhfg'} level={'jr'} text={''} />
      </Box>
  );
}
