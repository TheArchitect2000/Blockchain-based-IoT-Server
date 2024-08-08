import { Schema } from 'mongoose';


const schema = new Schema({
  name: {
    type: String,
    required: true,
    default: '',
  },
  details: {
    type: Object,
    required: false,
    default: {},
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    default: null,
  },
  insertDate: {
    type: Date,
    required: true,
  },
  updateDate: {
    type: Date,
    required: true,
  },
});

schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-aggregate-paginate-v2'));
schema.index({ '$**': 'text' });


export const BuildingSchema = schema;
