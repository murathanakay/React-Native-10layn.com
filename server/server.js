#!/usr/bin/env nodejs

//portekizce
//arapça
//korece
//rusça
//çince

var dbConf = {
  host: "127.0.0.1",
  user: "touchdigital",
  password: "Rsp01/Gg$",
  //database : 'blabapp_test',
  database: "10layn",
  charset: "utf8mb4",
};
if (process.env && process.env.OS && process.env.OS == "Windows_NT") {
  dbConf.host = "192.168.0.205";
}
var limit = 50;

var socketsByAccount = {};
var onlinesBySocket = {};
var banned_devices = [];

var fs = require("fs");
var path = require("path");
var app = require("express")();
if (process.env && process.env.OS && process.env.OS == "Windows_NT") {
  var http = require("http").Server(app);
} else {
  var key = fs.readFileSync("/etc/letsencrypt/live/api.10layn.com/privkey.pem");
  var cert = fs.readFileSync("/etc/letsencrypt/live/api.10layn.com/cert.pem");
  var ca = fs.readFileSync(
    "/etc/letsencrypt/live/api.10layn.com/fullchain.pem",
  );
  var sslOptions = {
    key: key,
    cert: cert,
    ca: ca,
    requestCert: false,
    rejectUnauthorized: false,
  };
  var http = require("https").Server(sslOptions, app);
}
var io = require("socket.io")(http);
var mysql = require("mysql");
var mysqlSync = require("sync-mysql");
var db = mysql.createConnection(dbConf);
//var RTCMultiConnectionServer = require('rtcmulticonnection-server');
var dbSync = new mysqlSync(dbConf);

var DB_PREFIX = "10layn_";

db.connect();

db.query("SET GLOBAL time_zone = '+3:00'");
db.query(
  "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))",
);
dbSync.query("SET GLOBAL time_zone = '+3:00'");
dbSync.query(
  "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))",
);

db.on("error", function (err) {
  console.log(err);
});

setInterval(function () {
  db.query("SELECT 1");
  dbSync.query("SELECT 1");
}, 60000);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type",
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/ping", function (req, res) {
  res.send("pong");
});
/*
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});*/
console.log("node server çalıştı.");

io.on("connection", function (socket) {
  console.log("node server çalıştı.");
  //RTCMultiConnectionServer.addSocket(socket);
  //////////////////////////////////////////////////////////////// Account related functions start here ////////////////////////////////////////////////////////////////
  var data = {};
  socket.on("get_all", function (user_id, clientFunc) {
    var offset = 0;
    data.categories = dbSync.query(
      "SELECT t.term_id id, t.name, t.slug, tx.parent FROM 10layn_terms t, 10layn_term_taxonomy tx WHERE t.term_id=tx.term_id AND t.term_id!=1 AND tx.taxonomy='category'",
    );
    //$data['tags'] = myobj("SELECT t.term_id id, t.name, t.slug, tx.parent FROM 10layn_terms t, 10layn_term_taxonomy tx WHERE t.term_id=tx.term_id AND t.term_id!=1 AND tx.taxonomy='post_tag'");
    data.settings = dbSync.query(
      "SELECT DISTINCT u.*, GROUP_CONCAT(nc.cat_id) as notification_cat_id FROM app_user u, notification_categories nc WHERE nc.user_id=" +
        user_id +
        " AND u.id=" +
        user_id,
    )[0];
    data.favorites = dbSync.query(
      "SELECT user_id, post_id FROM favori_post WHERE user_id=" + user_id,
    );
    data.notificationCat = dbSync.query(
      "SELECT user_id, cat_id FROM notification_categories WHERE user_id=" +
        user_id,
    );
    data.posts = dbSync.query(
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT " +
        offset +
        ",10",
    );
    clientFunc(data);
  });
  socket.on("postTag", function (id, catID, user_id, clientFunc) {
    var relatedPosts = {};
    relatedPosts.posts = dbSync.query(
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, fp.post_id favStar, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN favori_post fp ON (fp.post_id=p.ID AND fp.user_id=" +
        user_id +
        ") LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE tx.term_id=" +
        catID +
        " AND p.ID!=" +
        id +
        " AND p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY rand() LIMIT 3",
    );
    relatedPosts.tags = dbSync.query(
      "SELECT t.* FROM 10layn_terms as t, 10layn_term_taxonomy as tx , 10layn_term_relationships tr WHERE tr.object_id=" +
        id +
        " AND tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='post_tag' AND t.term_id=tx.term_id",
    );
    relatedPosts.cats = dbSync.query(
      "SELECT t.* FROM 10layn_terms as t, 10layn_term_taxonomy as tx , 10layn_term_relationships tr WHERE tr.object_id=" +
        id +
        " AND tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND t.term_id=tx.term_id",
    );
    clientFunc(relatedPosts);
  });
  socket.on("getPostTerm", function (id, type, currentCatPage, clientFunc) {
    var termPost = {};
    termPost = dbSync.query(
      "SELECT DISTINCT p.ID id, u.display_name author_name, p.post_name url,p.post_author,p.post_date indate,p.post_content content,p.post_title title, GROUP_CONCAT(tx2.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_relationships tr2 ON (tr2.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx2 ON (tx2.term_taxonomy_id=tr2.term_taxonomy_id AND tx2.taxonomy='category' AND tx2.parent=0) LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_id=tr.term_taxonomy_id AND tx.taxonomy='" +
        type +
        "') LEFT JOIN 10layn_terms t2 ON (t2.term_id=tx2.term_id) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE tx.term_id=" +
        id +
        " AND p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT " +
        currentCatPage +
        ",10",
    );
    //termPost = dbSync.query("SELECT DISTINCT GROUP_CONCAT(t.term_id) term_id FROM 10layn_posts p LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT "+currentCatPage+",10");
    clientFunc(termPost);
  });
  socket.on("notificationCat", function (user_id, catID, clientFunc) {
    var notCat = dbSync.query(
      "SELECT * FROM notification_categories WHERE user_id=" +
        user_id +
        " AND cat_id=" +
        catID,
    );
    if (notCat.length == 0) {
      dbSync.query(
        "INSERT INTO notification_categories (user_id, cat_id) VALUES (" +
          user_id +
          "," +
          catID +
          ")",
      );
      var result = "added";
      clientFunc(result);
    } else {
      dbSync.query(
        "DELETE FROM notification_categories WHERE user_id=" +
          user_id +
          " AND cat_id=" +
          catID,
      );
      var result = "deleted";
      clientFunc(result);
    }
  });
  socket.on("pinComment", function (user_id, value, clientFunc) {
    dbSync.query(
      "UPDATE app_user SET post_comment='" + value + "' WHERE id=" + user_id,
    );
    clientFunc(value);
  });
  socket.on("pinPost", function (user_id, value, clientFunc) {
    dbSync.query(
      "UPDATE app_user SET post_notification='" +
        value +
        "' WHERE id=" +
        user_id,
    );
    clientFunc(value);
  });
  socket.on("pinTheme", function (user_id, value, clientFunc) {
    dbSync.query(
      "UPDATE app_user SET theme='" + value + "' WHERE id=" + user_id,
    );
    clientFunc(value);
  });
  socket.on("fontUpdate", function (user_id, value, clientFunc) {
    dbSync.query(
      "UPDATE app_user SET font_size='" + value + "' WHERE id=" + user_id,
    );
    clientFunc(value);
  });
  socket.on("notificationGetPost", function (post_id, user_id, clientFunc) {
    var notificationPost = {};
    notificationPost.post = dbSync.query(
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, GROUP_CONCAT(tx2.term_id) all_cat, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url, (SELECT fp.post_id as star FROM favori_post fp WHERE fp.user_id=" +
        user_id +
        " AND fp.post_id=p.ID) as favStar FROM 10layn_posts p LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx2 ON (tx2.term_taxonomy_id=tr.term_taxonomy_id AND tx2.taxonomy='category') LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE p.ID=" +
        post_id +
        " AND p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT 1",
    )[0];
    notificationPost.tags = dbSync.query(
      "SELECT t.* FROM 10layn_terms as t, 10layn_term_taxonomy as tx , 10layn_term_relationships tr WHERE tr.object_id=" +
        post_id +
        " AND tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='post_tag' AND t.term_id=tx.term_id",
    );
    notificationPost.posts = dbSync.query(
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, fp.post_id favStar, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN favori_post fp ON (fp.post_id=p.ID AND fp.user_id=" +
        user_id +
        ") LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE tx.term_id IN(" +
        notificationPost.post.term_id +
        ") AND p.ID!=" +
        post_id +
        " AND p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT 3",
    );
    clientFunc(notificationPost);
  });
  socket.on("getLinkPost", function (post_url, user_id, clientFunc) {
    var getLinkPost = {};
    var url = post_url.replaceAll("/", "");
    getLinkPost.post = dbSync.query(
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, GROUP_CONCAT(tx2.term_id) all_cat, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url, (SELECT fp.post_id as star FROM favori_post fp WHERE fp.user_id='" +
        user_id +
        "' AND fp.post_id=p.ID) as favStar FROM 10layn_posts p LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx2 ON (tx2.term_taxonomy_id=tr.term_taxonomy_id AND tx2.taxonomy='category') LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE p.post_name='" +
        url +
        "' AND p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT 1",
    )[0];
    getLinkPost.tags = dbSync.query(
      "SELECT t.* FROM 10layn_terms as t, 10layn_term_taxonomy as tx , 10layn_term_relationships tr WHERE tr.object_id=" +
        getLinkPost.post.id +
        " AND tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='post_tag' AND t.term_id=tx.term_id",
    );
    getLinkPost.posts = dbSync.query(
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, fp.post_id favStar, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN favori_post fp ON (fp.post_id=p.ID AND fp.user_id=" +
        user_id +
        ") LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE tx.term_id IN(" +
        getLinkPost.post.term_id +
        ") AND p.ID!=" +
        getLinkPost.post.id +
        " AND p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT 3",
    );
    clientFunc(getLinkPost);
  });
  socket.on("addFavoriList", function (post_id, user_id, clientFunc) {
    var lastInsertFav = "";
    var result = "";
    var favori = dbSync.query(
      "SELECT * FROM favori_post WHERE user_id=" +
        user_id +
        " AND post_id=" +
        post_id,
    );
    if (favori.length > 0) {
      dbSync.query(
        "DELETE FROM favori_post WHERE user_id=" +
          user_id +
          " AND post_id=" +
          post_id,
      );
      result = "removed";
    } else {
      lastInsertFav = dbSync.query(
        "INSERT INTO favori_post (user_id,post_id) VALUES(" +
          user_id +
          "," +
          post_id +
          ")",
      );
      result = "added";
    }
    clientFunc(result);
  });
  socket.on("getFavoriList", function (currentPage, user_id, clientFunc) {
    var favoriPost = dbSync.query(
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) LEFT JOIN favori_post fp ON (fp.user_id=" +
        user_id +
        ") WHERE fp.post_id=p.ID AND p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT " +
        currentPage +
        ",10",
    );
    clientFunc(favoriPost);
  });
  socket.on("posts", function (offset, clientFunc) {
    data.posts = dbSync.query(
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE p.post_status='publish' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT " +
        offset +
        ",10",
    );
    clientFunc(data);
  });
  socket.on("search", function (search, user_id, clientFunc) {
    var sql =
      "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, fp.post_id favStar, GROUP_CONCAT(tx2.term_id) all_cat, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN favori_post fp ON (fp.post_id=p.ID AND fp.user_id=" +
      user_id +
      ") LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx2 ON (tx2.term_taxonomy_id=tr.term_taxonomy_id AND tx2.taxonomy='category') LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE p.post_status='publish' AND (post_content LIKE '%" +
      search.q.sqlize() +
      "%' OR post_title LIKE '%" +
      search.q.sqlize() +
      "%') AND p.post_type='post' GROUP BY p.ID ORDER BY (CASE WHEN p.post_title LIKE '%" +
      search.q.sqlize() +
      "%' THEN 1 ELSE 2 END) ASC, p.post_date DESC LIMIT " +
      search.p +
      ",10";
    var posts = dbSync.query(sql);
    clientFunc(posts);
  });
  socket.on(
    "author_posts",
    function (author_id, user_id, currentPage, clientFunc) {
      var sql =
        "SELECT DISTINCT p.ID id, p.post_name url, u.display_name author_name,p.post_author,p.post_date indate,p.post_content content,p.post_title title, fp.post_id favStar, GROUP_CONCAT(tx2.term_id) all_cat, GROUP_CONCAT(t.term_id) term_id, (SELECT p2.guid FROM 10layn_posts AS p2 WHERE p2.ID=CAST(pm.meta_value AS SIGNED) ORDER BY p2.post_date DESC LIMIT 1) as image_url FROM 10layn_posts p LEFT JOIN favori_post fp ON (fp.post_id=p.ID AND fp.user_id=" +
        user_id +
        ") LEFT JOIN 10layn_postmeta pm ON (pm.post_id=p.ID AND pm.meta_key='_thumbnail_id') LEFT JOIN 10layn_users u ON(u.ID=p.post_author) LEFT JOIN 10layn_term_relationships tr ON (tr.object_id=p.ID) LEFT JOIN 10layn_term_taxonomy tx2 ON (tx2.term_taxonomy_id=tr.term_taxonomy_id AND tx2.taxonomy='category') LEFT JOIN 10layn_term_taxonomy tx ON (tx.term_taxonomy_id=tr.term_taxonomy_id AND tx.taxonomy='category' AND tx.parent=0) LEFT JOIN 10layn_terms t ON (t.term_id=tx.term_id) WHERE p.post_status='publish' AND p.post_author='" +
        author_id +
        "' AND p.post_type='post' GROUP BY p.ID ORDER BY p.post_date DESC LIMIT " +
        currentPage +
        ",10";
      var posts = dbSync.query(sql);
      var author = dbSync.query(
        "SELECT meta_value FROM 10layn_usermeta WHERE user_id=" +
          author_id +
          " AND (meta_key='first_name' OR meta_key='last_name' OR meta_key='description')",
      );
      clientFunc(posts, author);
    },
  );
  socket.on("updateUserToken", function (user_id, token, clientFunc) {
    dbSync.query(
      "UPDATE app_user SET firebase_token='" + token + "' WHERE id=" + user_id,
    );
    clientFunc(token);
  });
  socket.on(
    "addUser",
    function (
      device_id,
      token,
      device_model,
      device_platform,
      device_version,
      device_brand,
      version,
      clientFunc,
    ) {
      if (device_platform == "Android") {
        var url =
          "https://play.google.com/store/apps/details?id=com.onlayn.app";
      } else {
        var url = "IOS Link";
      }
      console.log(version);
      dbSync.query(
        "INSERT INTO app_user (device_id, device_model, device_version, device_platform, device_brand, firebase_token, app_link, app_version) VALUES ('" +
          device_id +
          "', '" +
          device_model +
          "', '" +
          device_version +
          "', '" +
          device_platform +
          "', '" +
          device_brand +
          "', '" +
          token +
          "', '" +
          url +
          "','" +
          version +
          "')",
      );
      user_id = dbSync.query(
        "SELECT id FROM app_user ORDER BY id DESC LIMIT 1",
      )[0].id;
      clientFunc(user_id);
    },
  );

  socket.on("versionNumber", function (user_id, version, clientFunc) {
    var app_version = dbSync.query(
      "SELECT app_version FROM app_user WHERE id=" + user_id,
    )[0].app_version;
    if (app_version != version) {
      dbSync.query(
        "UPDATE app_user SET app_version='" + version + "' WHERE id=" + user_id,
      );
      clientFunc("updated");
    } else {
      clientFunc("not_updated");
    }
  });
});

String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

Array.prototype.pull = function (item) {
  var arr = this;
  for (var i = arr.length; i--; ) {
    if (arr[i] === item) {
      arr.splice(i, 1);
    }
  }
  return arr;
};

function getRandomString(len) {
  var text = "";
  var possible = "2345ABCDEFGHJKLMNPQRSTUVWXYZ6789";

  for (var i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function sqlize(val) {
  return typeof val == "string" || typeof val == "number"
    ? val.toString().replaceAll("'", "'")
    : val;
}

String.prototype.sqlize = function () {
  return this.replaceAll("'", "'");
};

Number.prototype.sqlize = function () {
  return this.toString().replaceAll("'", "'");
};

function mt_rand(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function time() {
  return parseInt(new Date().getTime() / 1000);
}
http.listen(8080, "0.0.0.0", function () {
  console.log("listening on *:8080");
});
