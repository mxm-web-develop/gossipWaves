- 目前只需要 sqlite, + json(tinydb in python)

{
  "name":String,
  "type":["model","service","application",'essay'],
  "is_open_source":Boolean,
  "date":Date,
  "post":{
    "content":String,
    "rawString":String,
  },
  "owner":String,
  "network":"non-cn","global","gientech-only",
  "isEvent":Boolean,
  "img":String,
  "sourceUrl":{
    "url":String,
    "iframeUrl":String,
    "githubUrl":String,
    "downloadUrl":String,
  },
  "tags":["tag1","tag2","tag3"]，
  "model_score":{
    "MMLU":Number,
    "GPQA":Number,
    "MMMU":Number,
    "HellaSWAG":Number,
    "HumanEval":Number,
    "BBHard":Number,
    "GSM8K":Number,
    "MATH":Number,
  },
  "status":"draft","published","archived"

}
