# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180326174008) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authors", force: :cascade do |t|
    t.string   "display_name"
    t.string   "channel_url"
    t.string   "profile_image_url"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "channel_id"
  end

  create_table "live_chat_messages", force: :cascade do |t|
    t.string   "google_id"
    t.string   "text_message"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "live_chat_id"
    t.datetime "published_at"
    t.integer  "author_id"
    t.index ["author_id"], name: "index_live_chat_messages_on_author_id", using: :btree
    t.index ["live_chat_id"], name: "index_live_chat_messages_on_live_chat_id", using: :btree
  end

  create_table "live_chats", force: :cascade do |t|
    t.string   "google_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "video_id"
    t.string   "video_title"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "token"
    t.string   "refresh_token"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  add_foreign_key "live_chat_messages", "authors"
  add_foreign_key "live_chat_messages", "live_chats"
end
