import React from "react";
import { SearchSelect } from "../shared/components";
import countries from "../shared/countries";

const CountriesSelect = ({ ...props }) => {
  return (
    <SearchSelect
      dataset={countries.map((c) => ({ id: c, description: c }))}
      {...props}
    />
  );
};

export default CountriesSelect;
