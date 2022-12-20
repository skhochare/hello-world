const basicSelectFilterQueryBuilder = (
  tableName,
  payload,
  onlyCountQuery = false,
  defaultIdField = "ID"
) => {
  const {
    fields,
    page,
    pageSize,
    orderBy,
    orderDirection,
    filters,
    search,
    additionalWhere,
    additionalWhereOr,
    joins,
    groupBy,
    groupByDefaultAggregateFn,
  } = payload;
  let query = "";
  const isGroupBy =
    groupBy && Array.isArray(groupBy) && groupBy.length ? true : false;
  const defaultAggregateFn = groupByDefaultAggregateFn
    ? groupByDefaultAggregateFn
    : "COUNT";

  if (onlyCountQuery) {
    query = `SELECT COUNT(${tableName}.${defaultIdField}) AS totalCount FROM ${tableName}`;
  } else {
    if (fields && fields.length) {
      const options = {
        isGroupBy,
        defaultAggregateFn,
      };
      const fieldsStr = prepareFieldsStr(fields, options);
      console.log(fieldsStr,"==================")
      query = `SELECT ${fieldsStr}  FROM  ${tableName} 
      `;
    } else {
      query = `SELECT * FROM ${tableName}`;
    }
  }

  if (joins && joins.length) {
    const joinStr = prepareJoinStr(joins);
    query += " " + joinStr;
  }

  const whereClauseOfORArr = [];
  if (search) {
    const arr = prepareForGlobalSearch(fields, search);
    whereClauseOfORArr.push(...arr);
  }

  if (additionalWhereOr && additionalWhereOr.length > 0) {
    additionalWhereOr.forEach((o) => {
      const { dbColumn, value, concatMask } = o;
      if (dbColumn) {
        let colm = dbColumn;
        const pipeIndex = colm.indexOf("|");
        if (pipeIndex >= 0) {
          colm = prepareConcatFieldStr(dbColumn, concatMask);
        }
        whereClauseOfORArr.push(`${colm} ${value}`);
      }
    });
  }

  const whereClauseArr = [];
  if (filters && filters.length) {
    const { and, or } = prepareForFilters(filters, fields);
    whereClauseArr.push(...and);
    whereClauseOfORArr.push(...or);
  }

  if (additionalWhere && additionalWhere.length > 0) {
    additionalWhere.forEach((o) => {
      const { dbColumn, value, concatMask } = o;
      if (dbColumn) {
        let colm = dbColumn;
        const pipeIndex = colm.indexOf("|");
        if (pipeIndex >= 0) {
          colm = prepareConcatFieldStr(dbColumn, concatMask);
        }
        whereClauseArr.push(`${colm} ${value}`);
      }
    });
  }

  const whereClauseStr = prepareWhereStr(whereClauseOfORArr, whereClauseArr);
  if (whereClauseStr) {
    query += ` ${whereClauseStr}`;
  }
  if (isGroupBy) {
    query += ` GROUP BY ${groupBy.join()} `;
  }

  if (!onlyCountQuery) {
    if (orderDirection && orderBy && orderBy.dbColumn) {
      const options = {
        isGroupBy,
        defaultAggregateFn,
      };
      const orderByStr = prepareOrderByStr(
        fields,
        orderBy,
        orderDirection,
        options
      );
      query += orderByStr;
    } else {
      if (isGroupBy) {
        query += ` ORDER BY ${defaultAggregateFn}(${tableName}.${defaultIdField}) DESC `;
      } else {
        query += ` ORDER BY ${tableName}.${defaultIdField} DESC `;
      }
    }

    const pageStr = preparePagination(page, pageSize);
    query += pageStr;
  }
  if (!onlyCountQuery && process.env.NODE_ENV !== "prod") {
    console.log(query);
  }
   
  if (onlyCountQuery && isGroupBy) {
    query = `SELECT COUNT(*) AS totalCount FROM (${query}) AS DummyTable`;
  }

  return query;
};

const prepareFieldsStr = (fields, options = null) => {
  return fields
    .filter((o) => o.dbColumn)
    .map((o) => {
      const { concatMask, aggregateFn } = o;
      let colm = o.dbColumn;
      const pipeIndex = colm.indexOf("|");
      if (pipeIndex >= 0) {
        colm = prepareConcatFieldStr(o.dbColumn, concatMask);
      }
      const columnAlias = prepareAlias(o.dbColumn);
      if (options && options.isGroupBy) {
        if (aggregateFn) {
          return `${aggregateFn}(${colm}) AS ${columnAlias}`;
        }
        return `${options.defaultAggregateFn}(${colm}) AS ${columnAlias}`;
      }
      return `${colm} AS ${columnAlias}`;
    })
    .join();
};

const prepareJoinStr = (joins) => {
  return joins
    .map(
      (j, i) =>
        `${j.type} JOIN ${j.table} AS ${prepareAlias(
          j.table
        )}_${i} ON ${prepareAlias(j.table)}_${i}.${j.id} = ${j.refTable}.${
          j.refId
        }`
    )
    .join(" ");
};

const prepareOrderByStr = (fields, orderBy, orderDirection, options = null) => {
  const { concatMask, aggregateFn, dbColumn, defaultAggregateFn } = orderBy;
  const fieldMeta = fields.find((o) => o.dbColumn === dbColumn);
  if (fieldMeta && !fieldMeta.skipFromFilter) {
    let colm = dbColumn;
    const pipeIndex = colm.indexOf("|");
    if (pipeIndex >= 0) {
      colm = prepareConcatFieldStr(dbColumn, concatMask);
    }
    if (fieldMeta.dataType && fieldMeta.dataType === "int") {
      if (options && options.isGroupBy) {
        if (aggregateFn) {
          return ` ORDER BY CAST(${aggregateFn}(${colm}) AS INT) ${orderDirection} `;
        }
        return ` ORDER BY CAST(${defaultAggregateFn}(${colm}) AS INT) ${orderDirection} `;
      }
      return ` ORDER BY CAST(${colm} AS INT) ${orderDirection} `;
    } else if (fieldMeta.dataType && fieldMeta.dataType === "date-range") {
      if (options && options.isGroupBy) {
        if (aggregateFn) {
          return ` ORDER BY ${aggregateFn}(${colm}) ${orderDirection} `;
        }
        return ` ORDER BY ${defaultAggregateFn}(${colm}) ${orderDirection} `;
      }
      return ` ORDER BY ${colm} ${orderDirection} `;
    } else {
      if (options && options.isGroupBy) {
        if (aggregateFn) {
          return ` ORDER BY ${aggregateFn}(${colm}) ${orderDirection} `;
        }
        return ` ORDER BY ${defaultAggregateFn}(${colm}) ${orderDirection} `;
      }
      return ` ORDER BY ${colm} ${orderDirection} `;
    }
  }
};

const preparePagination = (page, pageSize) => {
  return ` OFFSET ${page * pageSize} ROWS FETCH NEXT ${pageSize} ROWS ONLY `;
};

const prepareForGlobalSearch = (fields, search) => {
  const arr = [];
  fields.forEach((f) => {
    if (f.dbColumn) {
      if (!f.skipFromFilter) {
        let colm = f.dbColumn;
        const pipeIndex = colm.indexOf("|");
        if (pipeIndex >= 0) {
          const { concatMask } = f;
          colm = prepareConcatFieldStr(f.dbColumn, concatMask);
        }
        if (f.dataType && f.dataType === "int") {
          arr.push(` CAST(${colm} AS varchar) = '${search}' `);
        } else if (f.dataType && f.dataType === "date-range") {
          // Ignore the date range for global search as it does not have date picker
        } else {
          if (f.compareExactValue) {
            arr.push(` CAST(${colm} AS varchar) = '${search}' `);
          } else {
            arr.push(` CAST(${colm} AS varchar) LIKE '%${search}%' `);
          }
        }
      }
    }
  });
  return arr;
};

const prepareForFilters = (filters, fields) => {
  const and = [];
  const or = [];
  filters.forEach((o) => {
    const {
      value,
      column: { dbColumn, concatMask },
    } = o;
    if (dbColumn) {
      const fieldMeta = fields.find((o) => o.dbColumn === dbColumn);
      if (fieldMeta && !fieldMeta.skipFromFilter) {
        let colm = dbColumn;
        const pipeIndex = colm.indexOf("|");
        if (pipeIndex >= 0) {
          colm = prepareConcatFieldStr(dbColumn, concatMask);
        }
        if (fieldMeta.dataType && fieldMeta.dataType === "int") {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              or.push(` CAST(${colm} AS varchar) = '${v}' `);
            });
          } else {
            and.push(` CAST(${colm} AS varchar) = '${value}' `);
          }
        } else if (fieldMeta.dataType && fieldMeta.dataType === "date-range") {
          if (Array.isArray(value)) {
            const [start, end] = value;
            if (start && end) {
              and.push(` ${colm} BETWEEN '${start}' AND '${end}' `);
            }
          }
        } else {
          if (fieldMeta.compareExactValue) {
            if (Array.isArray(value)) {
              value.forEach((v) => {
                or.push(` ${colm} = '${v}' `);
              });
            } else {
              and.push(` ${colm} = '${value}' `);
            }
          } else {
            if (Array.isArray(value)) {
              value.forEach((v) => {
                or.push(` ${colm} LIKE '%${v}%' `);
              });
            } else {
              and.push(` ${colm} LIKE '%${value}%' `);
            }
          }
        }
      }
    }
  });
  return { and, or };
};

const prepareWhereStr = (or, and) => {
  let query = "";
  if (or.length || and.length) {
    query = "WHERE";
  }
  if (or.length) {
    query += ` (${or.join(" OR ")}) `;
  }
  if (and.length) {
    if (or.length) {
      query += ` AND `;
    }
    query += ` (${and.join(" AND ")}) `;
  }
  return query;
};

const prepareAlias = (column) => {
  return column.replace(/[\.\|\s]/gi, "_").replace(/[\[\]]/gi, "");
};

const prepareConcatFieldStr = (column, mask) => {
  const joinColumnsArr = column.split("|");
  if (mask) {
    const maskArr = mask.split("");
    const newJoinCols = maskArr.map((o) => {
      if (o !== "x") {
        return `'${o}'`;
      }
      return o;
    });
    for (let index = 0; index < joinColumnsArr.length; index++) {
      const col = joinColumnsArr[index];
      const indexOfX = newJoinCols.indexOf("x");
      if (indexOfX >= 0) {
        newJoinCols.splice(indexOfX, 1, col);
      }
    }
    return `CONCAT(${newJoinCols.join()})`;
  } else {
    const [first] = joinColumnsArr;
    const newJoinCols = [first];
    for (let index = 1; index < joinColumnsArr.length; index++) {
      const col = joinColumnsArr[index];
      newJoinCols.push("' '", col);
    }
    return `CONCAT(${newJoinCols.join()})`;
  }
};

module.exports = {
  basicSelectFilterQueryBuilder,
  prepareFieldsStr,
  prepareOrderByStr,
  preparePagination,
  prepareForGlobalSearch,
  prepareForFilters,
  prepareWhereStr,
  prepareAlias,
  prepareConcatFieldStr,
};
