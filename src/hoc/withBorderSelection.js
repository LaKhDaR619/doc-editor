import React, { useState, useEffect, cloneElement, Fragment } from "react";

export default function withBorderSelection(TableComponent) {
  return (props) => {
    const [cursor, setCursor] = useState("default");
    const [selectedBorders, setSelectedBorders] = useState([]);

    useEffect(() => {
      //console.log(selectedBorders);
    }, [selectedBorders]);

    const handleMouseMove = (e) => {
      const { x, y, width, height } = e.target.getBoundingClientRect();
      const mouseX = e.nativeEvent.clientX;
      const mouseY = e.nativeEvent.clientY;

      // handling the Cursor
      if (mouseX < x + 4 || mouseX - width > x - 4) setCursor("col-resize");
      else if (mouseY < y + 4 || mouseY - height > y - 4)
        setCursor("row-resize");
      else setCursor("default");
    };

    const handleClick = (e) => {
      const { x, y, width, height } = e.target.getBoundingClientRect();
      const mouseX = e.nativeEvent.clientX;
      const mouseY = e.nativeEvent.clientY;

      let border = {
        // global styles
        style: {
          position: "absolute",
          background: "lightblue",
          opacity: 0.5,
          cursor: "col-resize",
        },
      };

      if (mouseX < x + 4) {
        border = {
          // extra info
          position: "left",
          style: {
            ...border.style,
            left: `${x - 4}px `,
            top: `${y}px`,
            height: `${height}px`,
            width: "8px",
          },
        };
      } else if (mouseX - width > x - 4) {
        border = {
          // extra info
          position: "right",
          style: {
            ...border.style,
            left: `${x - 4 + width}px`,
            top: `${y}px`,
            height: `${height}px`,
            width: "8px",
          },
        };
      } else if (mouseY < y + 4) {
        border = {
          // extra info
          position: "top",
          style: {
            ...border.style,
            left: `${x}px`,
            top: `${y - 4}px`,
            height: `8px`,
            width: `${width}px`,
          },
        };
      } else if (mouseY - height > y - 4) {
        border = {
          // extra info
          position: "bottom",
          style: {
            ...border.style,
            left: `${x}px`,
            top: `${y - 4 + height}px`,
            height: `8px`,
            width: `${width}px`,
          },
        };
      }

      border = { ...border, id: `${x}_${y}_${border.position}` };

      // didn't select any border
      if (!border.position) return setSelectedBorders([]);
      // if the user selected a border and didn't press ctrl key
      if (!e.ctrlKey) return setSelectedBorders([border]);

      // if the user selected a border and pressed ctrl key
      setSelectedBorders([...selectedBorders, border]);
    };

    const handleBorderClick = (e) => {
      const index = e.target.dataset.index;

      if (!e.ctrlKey) return setSelectedBorders([selectedBorders[index]]);

      // if the user pressed ctrl key we remove the border from the selected array
      selectedBorders.splice(index, 1);
      setSelectedBorders([...selectedBorders]);
    };

    const updatePropertyById = (type, node) => {
      let newChildren = [];

      // if the children is a String (this is the base case of children)
      if (typeof node.props.children === "string") {
        newChildren = node.props.children;
      }
      // if the children are an array
      else if (node.props.children && node.props.children.length > 0) {
        for (let i = 0; i < node.props.children.length; i++) {
          newChildren[i] = updatePropertyById(type, node.props.children[i]);
        }
      }
      // if the children is an object
      else if (node.props.children && !Array.isArray(node.props.children)) {
        newChildren = updatePropertyById(type, node.props.children);
      }

      let newNode = [];

      if (node.type === type) {
        newNode = cloneElement(node, {
          children: newChildren,
          onClick: handleClick,
          onMouseMove: handleMouseMove,
          style: { cursor },
        });
      } else {
        newNode = cloneElement(node, {
          children: newChildren,
        });
      }

      return newNode;
    };

    const transformChildren = (children) => {
      // checking if it's a table
      /*const isAtable =
          !children || Array.isArray(children) || children.type !== "table";
        const hasATbody = children.props.children.type !== "tbody";
  
        if (!isAtable || !hasATbody) {
          return children;
        }*/

      let newChildren = updatePropertyById("td", children);
      return newChildren;
    };

    return (
      <Fragment>
        {selectedBorders.map((border, index) => (
          <div
            key={index.toString()}
            style={border.style}
            data-index={index}
            onClick={handleBorderClick}
          />
        ))}
        <TableComponent
          {...props}
          children={transformChildren(props.children)}
        />
      </Fragment>
    );
  };
}
