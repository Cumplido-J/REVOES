import React from "react";
import { Row, Col } from "antd";
import {Title} from "../shared/components"

/*
 * Title component 
 * @param {Object} props
 * @param {HTML} props.children
 * @returns {Object} React hook component
 * */
const styles = {
  rowStyles: {
  	marginTop: "1em"
	},
};
export default ({children}) => {
  const {rowStyles} = styles;
  return (
    <>
			<Row style={rowStyles}>
        <Col xs={{ span: 24 }}>
          <Title>{children}</Title>
        </Col>
      </Row>
    </>
  );
};
