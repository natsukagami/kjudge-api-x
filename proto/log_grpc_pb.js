// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var proto_log_pb = require('../proto/log_pb.js');

function serialize_logging_Count(arg) {
  if (!(arg instanceof proto_log_pb.Count)) {
    throw new Error('Expected argument of type logging.Count');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_logging_Count(buffer_arg) {
  return proto_log_pb.Count.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_logging_Log(arg) {
  if (!(arg instanceof proto_log_pb.Log)) {
    throw new Error('Expected argument of type logging.Log');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_logging_Log(buffer_arg) {
  return proto_log_pb.Log.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_logging_Logs(arg) {
  if (!(arg instanceof proto_log_pb.Logs)) {
    throw new Error('Expected argument of type logging.Logs');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_logging_Logs(buffer_arg) {
  return proto_log_pb.Logs.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_logging_Reply(arg) {
  if (!(arg instanceof proto_log_pb.Reply)) {
    throw new Error('Expected argument of type logging.Reply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_logging_Reply(buffer_arg) {
  return proto_log_pb.Reply.deserializeBinary(new Uint8Array(buffer_arg));
}


// Defines the logging service.
var LoggingService = exports.LoggingService = {
  print: {
    path: '/logging.Logging/print',
    requestStream: false,
    responseStream: false,
    requestType: proto_log_pb.Log,
    responseType: proto_log_pb.Reply,
    requestSerialize: serialize_logging_Log,
    requestDeserialize: deserialize_logging_Log,
    responseSerialize: serialize_logging_Reply,
    responseDeserialize: deserialize_logging_Reply,
  },
  fetch: {
    path: '/logging.Logging/fetch',
    requestStream: false,
    responseStream: false,
    requestType: proto_log_pb.Count,
    responseType: proto_log_pb.Logs,
    requestSerialize: serialize_logging_Count,
    requestDeserialize: deserialize_logging_Count,
    responseSerialize: serialize_logging_Logs,
    responseDeserialize: deserialize_logging_Logs,
  },
};

exports.LoggingClient = grpc.makeGenericClientConstructor(LoggingService);
