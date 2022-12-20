const express = require("express");
const { sql, poolPromise } = require("../../config/mssql_hr.config.js");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const fs = require("fs");
const moment = require("moment");
var convert = require("xml-js");

exports.filterEvents = async function (req, res) {
  const { page, table, primaryKey } = req.body;
  const pId = primaryKey ? primaryKey : null;
  const payload = { ...req.body };
  const query = basicSelectFilterQueryBuilder(table, payload, false, pId);
  const queryCnt = basicSelectFilterQueryBuilder(table, payload, true, pId);
  try {
    const pool = await poolPromise;
    const resultCnt = await pool.request().query(queryCnt);
    const [{ totalCount }] = resultCnt.recordset;
    const result = await pool.request().query(query);
    const response = {
      data: result.recordset,
      page,
      totalCount,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.rawBody = (request, response, next) => {
  const { headers, method, url } = request;
  let body = [];
  request
    .on("error", (err) => {
      console.error(err);
    })
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      // BEGINNING OF NEW STUFF
      if (body !== "") {
        const result = convert.xml2js(body, {
          compact: true,
          spaces: 4,
        });
        const name = result.IALRT05.id._text;
        const date = moment(result.IALRT05.time._text).format(
          "YYYY_MM_DD_h_mm_ss_A"
        );
        const filename = `${name}_${date}.xml`;

        var writeStream = fs.createWriteStream(
          `./shotspotterfiles/${filename}`
        );
        writeStream.write(body);
        writeStream.end();
      }

      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      const responseBody = { headers, method, url, body };
      response.write(JSON.stringify(responseBody));
      response.end();
      request.rawBody = body;
      next();
    });
};

exports.storeRequest = async (request, response, next) => {
  try {
    const query = `
        INSERT INTO [ShotSpotterEvents]
          (EventDate, EventBody)
        VALUES
          (@EventDate, @EventBody)
      `;
    const pool = await poolPromise;
    await pool
      .request()
      .input("EventDate", sql.DateTime2, new Date())
      .input("EventBody", sql.VarChar, request.rawBody)
      .query(query);
    response.on("error", (err) => {
      console.error(err);
    });
  } catch (err) {
    response.status(500).send(err.message);
  }
};

exports.getShotspotterEvents = async (req, res) => {
  const query = `SELECT * FROM ShotSpotterEvents ORDER BY Id Desc`;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Shotspotter Events Fetched Successfully!",
        error: "",
      });
    } else {
      return res.status(200).json({
        status: 0,
        data: [],
        message: "",
        error: "Something went wrong! Please try again later.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};
