// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var proto_files_pb = require('../proto/files_pb.js');

function serialize_pb_Digest(arg) {
  if (!(arg instanceof proto_files_pb.Digest)) {
    throw new Error('Expected argument of type pb.Digest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_Digest(buffer_arg) {
  return proto_files_pb.Digest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_File(arg) {
  if (!(arg instanceof proto_files_pb.File)) {
    throw new Error('Expected argument of type pb.File');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_File(buffer_arg) {
  return proto_files_pb.File.deserializeBinary(new Uint8Array(buffer_arg));
}


var FilesService = exports.FilesService = {
  download: {
    path: '/pb.Files/Download',
    requestStream: false,
    responseStream: false,
    requestType: proto_files_pb.Digest,
    responseType: proto_files_pb.File,
    requestSerialize: serialize_pb_Digest,
    requestDeserialize: deserialize_pb_Digest,
    responseSerialize: serialize_pb_File,
    responseDeserialize: deserialize_pb_File,
  },
  upload: {
    path: '/pb.Files/Upload',
    requestStream: false,
    responseStream: false,
    requestType: proto_files_pb.File,
    responseType: proto_files_pb.Digest,
    requestSerialize: serialize_pb_File,
    requestDeserialize: deserialize_pb_File,
    responseSerialize: serialize_pb_Digest,
    responseDeserialize: deserialize_pb_Digest,
  },
};

exports.FilesClient = grpc.makeGenericClientConstructor(FilesService);
