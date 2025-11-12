//import pool
//import dotenv.js
//import data.js

//create table queries

/*
dbdiagram.io structure:

Table users {
  id integer [primary key]
  username varchar
  password varchar
  points integer
}

Table habits {
  id integer [primary key]
  user_id integer [not null]
  title varchar
  description text [note: 'Description of the habit']
}

Table tags {
  id integer [primary key]
  name varchar
}

Table habitTags { //join table
  habit_id integer [not null]
  tag_id integer [not null]
}

Table stickers {
  id integer [primary key]
  name varchar
  price integer
  image_url url
}

Table userStickers {
  user_id integer [not null]
  sticker_id integer [not null]
}

Ref user_habits: habits.user_id > users.id // many-to-one

Ref link_habit_id_to_habitTag: habitTags.habit_id > habits.id

Ref link_tag_id_to_habitTag: habitTags.tag_id > tags.id

Ref link_user_id_to_userStickers: userStickers.user_id > users.id

Ref link_sticker_id_to_userStickers: userStickers.sticker_id > stickers.id

*/
