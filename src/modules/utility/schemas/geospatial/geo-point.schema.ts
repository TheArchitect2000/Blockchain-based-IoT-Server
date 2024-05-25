import { Schema } from 'mongoose';
import { GeoJsonTypeEnum } from 'src/modules/utility/enums/geo-json-type.enum';

const schema = new Schema({
  type: {
    type: String,
    enum: GeoJsonTypeEnum, //  enum: ['Point', ...],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

export const geoPointSchema = schema;
