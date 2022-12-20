const { sql, poolPromise } = require("../../config/mssql_hr.config.js");

exports.staffSummary = async function (req, res) {
  const {grp} = req.params
  console.log(grp, req.params)
  try {
    let query = ""
    // 0 denote non sworn and 1 denote sworn
     if(grp==0) {
      query = `
      WITH qry AS                            
      ( SELECT CASE when GROUP_AS is NULL then '**' + E.Title + '**' else GROUP_AS end as TTitle   
      
        ,CASE when Group_AS = 'SWORN OFFICERS' then 'SWORN OFFICERS'     
      
                    else 'TOTAL NON-SWORN'   
         
               end as Grp0   
      
              ,CASE when GROUP_AS = 'RECRUITS' then 9   
          when Group_AS = 'SWORN OFFICERS' then 1   
          when GROUP_AS = 'SLEO I' then 2   
          when GROUP_AS = 'SLEO II' then 3   
          when GROUP_AS = 'SLEO II WAIVER' then 2   
          when GROUP_AS = 'POLICE AIDE' then 4   
          when GROUP_AS = 'DISPATCHER' then 5    
          when GROUP_AS = 'CIVILIAN' then 6   
          when GROUP_AS = 'OZITUS' then 7   
          when GROUP_AS ='SEASONAL INVESTIGATORS' then 8   
          else 10   
                 end as Grp1  ,GROUP_AS 
                ,username as U3, E.Title  ,E.Title2 
      
         FROM CCPD_Employees E   
      
          join   
      
              title T on E.Title2 = T.id  
      
         where e.isactive=1 
      
        AND   t.TITLE not in ('CROSSING GUARD SUPERVISOR','CROSSING GUARD','CROSSING GUARD ASSISTANT SUPERVISOR')   
      
        union all 
      
        SELECT case when title2 is null then 'NO TITLE ASSIGNED' else 'CROSS GUARD RELATED'  end as TTitle   
      
        ,CASE when Group_AS = 'SWORN OFFICERS' then 'SWORN OFFICERS'     
      
                    else 'TOTAL NON-SWORN'   
      
               end as Grp0   
      
              ,case when title2 is null then 11 else 12 end 
      
                   as Grp1  ,GROUP_AS 
      
                ,username as U3, E.Title  ,E.Title2 
      
         FROM CCPD_Employees E   
      
         left join   
      
              title T on E.Title2 = T.id  
      
         where e.isactive=1 
      
        AND  ( t.TITLE  in ('CROSSING GUARD SUPERVISOR','CROSSING GUARD','CROSSING GUARD ASSISTANT SUPERVISOR')  or title2 is null ) 
      )   
      
      SELECT   
         Grp0, Grp1,
       TTitle,
          SUM(case when u3 is not null then 1 else 0 end) as u3       
      FROM qry    
      group by Grp0, Grp1, TTitle
      order by TTitle ASC`;
     }else if(grp==1){
      query = `WITH qry AS    
    
      (SELECT distinct Title2 as job_title    
             ,swornofficer, Status    
             ,E3.username as U3  , U1=case when swornofficer=1 then  1 else 0 end,  U2=case when swornofficer=0 then  1 else 0 end    
        FROM CCPD_Employees E3   join   
          title t on t.id=e3.title2  
       where t.TITLE  not IN ('CROSSING GUARD SUPERVISOR','CROSSING GUARD','CROSSING GUARD ASSISTANT SUPERVISOR')    
      and e3.isactive=1  
       
      union all  
        
      SELECT distinct case when title2 is null then null else title2 end as job_title    
             ,swornofficer, Status    
             ,E3.username as U3  , U1=case when swornofficer=1 then  1 else 0 end,  U2=case when swornofficer=0 then  1 else 0 end    
        FROM [CCPD_Employees] E3   left join   
          title t on t.id=e3.title2  
       where (t.TITLE  IN ('CROSSING GUARD SUPERVISOR','CROSSING GUARD','CROSSING GUARD ASSISTANT SUPERVISOR')  or title2 is null)  
      and e3.isactive=1  
     )    
       
     select * , rn = row_number() over (order by hierarchy, job_title  ) from (  
     --   Titles NOT in TITLE table are printed as an **(CCPD_Employees.Title)----    
     SELECT 
     --row_number() over (order by title.title ) rownumber,
     
     case when Title_Hierarchy is NULL then 'Unknown Title' else title.title end as job_title  --then '**' + 'Unknown Title' + '**' else title.title end as job_title  
            ,case when Title_Hierarchy is NULL then 999 else Title_Hierarchy end as Hierarchy                       
           ,sum(u1) as u1    
           ,SUM(u2) as u2    
           ,count(1) as u3    
     FROM qry     
     left join Title     
     on job_title = id    
     where u1>0
     
     group by title.title, Title_Hierarchy 
        ) a  ORDER BY job_title`
     }
 
    console.log(query)
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};

exports.tempInactiveStatus = async function (req, res) {
  try {
    const query = `
    with qry as(
      select reason,
      count(1) as total,
      sum(case when swornofficer=1 then 1 else 0 end) as sworncount,
      sum(case when swornofficer=0 then 1 else 0 end)
      as nonsworncount  from (
      SELECT  EmployeeLeaves.ReasonCode as Reason     
      
               ,swornofficer     
      
         ,EmployeeLeaves.StartDate     
      
               ,EmployeeLeaves.EndDate     
      
         ,E3.UserName as U3     
      
               ,Status     
      
               ,CASE WHEN getdate() between startdate and  DATEADD(DAY,1,EndDate) then 1      
      
               WHEN getdate() >= startdate and enddate is NULL then 1     
      
               else 0      
      
          END as inactivet           
      
         FROM CCPD_Employees  E3      
      
         left outer join EmployeeLeaves on E3.UserName = EmployeeLeaves.UserName   where isactive=1
      
         and leavestatus <> 'canceled'   
      
           ) a
             where  Reason NOT IN ( 'FMLA-I', 'Other') and inactivet=1
             group by reason
      )
      
      SELECT reasondescription as ReasonDescription    
            ,total as u1   
            ,sworncount as u2    
            ,nonsworncount as u3   
      from qry  q join [LeaveReasons] l on l.reasoncode=q.reason
        `;

    const pool = await poolPromise;
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};

exports.staffSummaryEmployeeList = async function (req, res) {
  try {
    const { title, grp, page, rowperpage, orderDirection, orderBy, searchText } =
      req.body;
    let swornCondition = ``;
    if (grp == "SWORN OFFICERS") {
      swornCondition = ` WHERE et.Title='${title}' AND e.SwornOfficer = 1 AND e.IsActive = 1 AND et.TITLE not in ('CROSSING GUARD SUPERVISOR','CROSSING GUARD','CROSSING GUARD ASSISTANT SUPERVISOR') `;
    } else if (title == "CROSS GUARD RELATED") {
      swornCondition = ` WHERE e.IsActive = 1 AND  et.TITLE in('CROSSING GUARD SUPERVISOR','CROSSING GUARD','CROSSING GUARD ASSISTANT SUPERVISOR') `;
    } else if (grp !== "SWORN OFFICERS") {
      swornCondition = ` WHERE et.Group_AS = '${title}' AND (e.SwornOfficer = 0 OR e.SwornOfficer IS NULL) AND e.IsActive = 1 AND et.TITLE not in ('CROSSING GUARD SUPERVISOR','CROSSING GUARD','CROSSING GUARD ASSISTANT SUPERVISOR') `;
    }
    if (searchText) {
      swornCondition += ` AND (e.FirstName LIKE '%${searchText}%' OR e.LastName LIKE '%${searchText}%' )`;
    }
    const offset = parseInt(page * rowperpage);
    const query = `SELECT
    e.EmployeeId,
    e.LastName,
    e.FirstName,
    e.CellPhone,
    b.Title AS BureauDesc,
    d.Title AS DivisionDesc,
    u.Title AS UnitDesc,
    e.SwornOfficer,
    et.Title AS Title,
	  et.Group_AS AS TitleGroupAs
  FROM
    CCPD_Employees AS e
  LEFT JOIN
    Department AS b
  ON
    b.Id = e.Bureau AND b.Level = 1
  LEFT JOIN
    Department AS d
  ON
    d.Id = e.Division2 AND d.Level = 2
  LEFT JOIN
    Department AS u
  ON
    u.Id = e.Unit2 AND u.Level = 3
  LEFT JOIN
    Title AS et
  ON
    e.Title2 = et.ID
  ${swornCondition}
  ORDER BY
    FirstName ASC OFFSET ${offset} ROWS FETCH NEXT ${rowperpage} ROWS ONLY `;

    const query2 = `SELECT
    COUNT(*) AS totalCount
  FROM
    CCPD_Employees AS e
  LEFT JOIN
    Title AS et
  ON
    e.Title2 = et.ID ${swornCondition}`;
    console.log(query,"====================", query2)

    const pool = await poolPromise;
    const result = await pool.request().query(query);
    const result2 = await pool.request().query(query2);
    console.log(query);
    if (result && result.recordset) {
      const [{ totalCount }] = result2.recordset;
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        total: totalCount,
        message: "Records Fetched Successfully!",
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
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};

exports.tempInActiveLeaveEmployeesList = async function (req, res) {
  try {
    const { reason, page, rowperpage, orderDirection, orderBy, searchText } =
      req.body;
    const offset = parseInt(page * rowperpage);
    let clouse = '';
    if (searchText) {
      clouse = ` AND (E.FirstName LIKE '%${searchText}%' OR E.LastName LIKE '%${searchText}%' )`;
    }
    const query = `SELECT EL.UserName
    ,EL.ReasonDescription,
      E.EmployeeId,
      E.LastName,
      E.FirstName,
      E.CellPhone,
    E.SwornOfficer,
    b.Title AS BureauDesc,
      d.Title AS DivisionDesc,
      u.Title AS UnitDesc,
      et.Title AS Title
    FROM EmployeeLeaves AS EL
    LEFT JOIN CCPD_Employees AS E
    ON E.UserName = EL.UserName
    LEFT JOIN
      Department AS b
    ON
      b.Id = e.Bureau AND b.Level = 1
    LEFT JOIN
      Department AS d
    ON
      d.Id = e.Division2 AND d.Level = 2
    LEFT JOIN
      Department AS u
    ON
      u.Id = e.Unit2 AND u.Level = 3
    LEFT JOIN
      Title AS et
    ON
      e.Title2 = et.ID
    WHERE EL.ReasonDescription = '${reason}' ${clouse} AND leavestatus <> 'canceled' AND E.IsActive = 1 AND ((getdate() between EL.startdate and  DATEADD(DAY,1,EL.EndDate)) OR (getdate() >= startdate and enddate is NULL)) ORDER BY
    FirstName ASC OFFSET ${offset} ROWS FETCH NEXT ${rowperpage} ROWS ONLY`;

    const query2 = `SELECT COUNT(*) AS totalCount
    FROM EmployeeLeaves AS EL
    LEFT JOIN CCPD_Employees AS E
    ON E.UserName = EL.UserName
    LEFT JOIN
      Department AS b
    ON
      b.Id = e.Bureau AND b.Level = 1
    LEFT JOIN
      Department AS d
    ON
      d.Id = e.Division2 AND d.Level = 2
    LEFT JOIN
      Department AS u
    ON
      u.Id = e.Unit2 AND u.Level = 3
    LEFT JOIN
      Title AS et
    ON
      e.Title2 = et.ID
    WHERE EL.ReasonDescription = '${reason}' AND leavestatus <> 'canceled' AND E.IsActive = 1 AND ((getdate() between EL.startdate and  DATEADD(DAY,1,EL.EndDate)) OR (getdate() >= startdate and enddate is NULL))`;
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    const result2 = await pool.request().query(query2);
    if (result && result.recordset) {
      const [{ totalCount }] = result2.recordset;
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        total: totalCount,
        message: "Records Fetched Successfully!",
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
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};
