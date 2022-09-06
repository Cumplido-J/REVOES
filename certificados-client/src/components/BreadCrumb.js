import React from "react";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

/*
 * Breadcrumb component
 * @param {Object} props
 * @param {Array} props.links
 * @param {Object} props.links[index]
 * @param {String} props.links[index].path
 * @param {String} props.links[index].text
 * @returns {Object} React hook component
 * */
const styles = {
  itemStyles: {
    color: "black"
  }
};
export default ({ links }) => {
	links = [{text: (<HomeOutlined/>), path: '/'}, ...links]
  const { itemStyles } = styles;
  return (
    <>
      <Breadcrumb>
        {links.map((link, index) => (
          <Breadcrumb.Item key={link.text + index} style={itemStyles}>
            {link.path ? (
              <Link to={link.path}>
                <span>{link.text}</span>
              </Link>
            ) : (
              <span>{link.text}</span>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </>
  );
};
