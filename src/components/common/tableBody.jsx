import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (i, c) => {
    if (c.content) return c.content(i);
    return _.get(i, c.path);
  };

  createKey = (i, c) => {
    return i.id + (c.path || c.key);
  };

  render() {
    const { data, columns } = this.props;
    return (
      <tbody>
        {data.map((i) => (
          <tr key={i.id}>
            {columns.map((c) => (
              <td key={this.createKey(i, c)}>{this.renderCell(i, c)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
