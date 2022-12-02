import mysql2 from 'mysql2'; // npm i mysql2 --save

// create connection to do
export var conn = mysql2.createConnection({
  host : "localhost",
  user : "root" 
  //database : "spotify"
});

// connect to db
conn.connect(function(err) {
  if(err) console.log("Unable to connect to mysql database.");//throw err; (optional)
  else {
    console.log("Successfully connected to mysql database.");

    // create db if not exists
    conn.query("CREATE DATABASE IF NOT EXISTS `spotify`", function (err, result) {
      if (err) throw err;
      //console.log("Verifying existence of databse");
    });

    // switch to db
    conn.changeUser({database : 'spotify'}, function(err) {
      if (err) throw err;
    });

    // create history table if not exists
    let table = `CREATE TABLE IF NOT EXISTS \`history\` (
      \`user_id\` varchar(255) NOT NULL,
      \`song_id\` varchar(100) NOT NULL,
      \`song_name\` varchar(100) NOT NULL,
      \`played_at\` datetime NOT NULL,
      \`album_url\` varchar(255) NOT NULL,
      UNIQUE KEY \`user_song_played\` (\`user_id\`,\`song_id\`,\`played_at\`)
      )`
    conn.query(table, function(err, result) {
      if (err) throw err;
      //console.log("Table created successfully.");
    });
  }
});