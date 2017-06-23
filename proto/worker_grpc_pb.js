// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var proto_worker_pb = require('../proto/worker_pb.js');

function serialize_worker_Compilation(arg) {
  if (!(arg instanceof proto_worker_pb.Compilation)) {
    throw new Error('Expected argument of type worker.Compilation');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_worker_Compilation(buffer_arg) {
  return proto_worker_pb.Compilation.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_worker_CompileResult(arg) {
  if (!(arg instanceof proto_worker_pb.CompileResult)) {
    throw new Error('Expected argument of type worker.CompileResult');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_worker_CompileResult(buffer_arg) {
  return proto_worker_pb.CompileResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_worker_Empty(arg) {
  if (!(arg instanceof proto_worker_pb.Empty)) {
    throw new Error('Expected argument of type worker.Empty');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_worker_Empty(buffer_arg) {
  return proto_worker_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_worker_Shard(arg) {
  if (!(arg instanceof proto_worker_pb.Shard)) {
    throw new Error('Expected argument of type worker.Shard');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_worker_Shard(buffer_arg) {
  return proto_worker_pb.Shard.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_worker_TestResult(arg) {
  if (!(arg instanceof proto_worker_pb.TestResult)) {
    throw new Error('Expected argument of type worker.TestResult');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_worker_TestResult(buffer_arg) {
  return proto_worker_pb.TestResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_worker_Testrun(arg) {
  if (!(arg instanceof proto_worker_pb.Testrun)) {
    throw new Error('Expected argument of type worker.Testrun');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_worker_Testrun(buffer_arg) {
  return proto_worker_pb.Testrun.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_worker_Usage(arg) {
  if (!(arg instanceof proto_worker_pb.Usage)) {
    throw new Error('Expected argument of type worker.Usage');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_worker_Usage(buffer_arg) {
  return proto_worker_pb.Usage.deserializeBinary(new Uint8Array(buffer_arg));
}


var WorkerService = exports.WorkerService = {
  compile: {
    path: '/worker.Worker/Compile',
    requestStream: false,
    responseStream: false,
    requestType: proto_worker_pb.Compilation,
    responseType: proto_worker_pb.CompileResult,
    requestSerialize: serialize_worker_Compilation,
    requestDeserialize: deserialize_worker_Compilation,
    responseSerialize: serialize_worker_CompileResult,
    responseDeserialize: deserialize_worker_CompileResult,
  },
  run: {
    path: '/worker.Worker/Run',
    requestStream: false,
    responseStream: false,
    requestType: proto_worker_pb.Testrun,
    responseType: proto_worker_pb.TestResult,
    requestSerialize: serialize_worker_Testrun,
    requestDeserialize: deserialize_worker_Testrun,
    responseSerialize: serialize_worker_TestResult,
    responseDeserialize: deserialize_worker_TestResult,
  },
  getShard: {
    path: '/worker.Worker/GetShard',
    requestStream: false,
    responseStream: false,
    requestType: proto_worker_pb.Empty,
    responseType: proto_worker_pb.Shard,
    requestSerialize: serialize_worker_Empty,
    requestDeserialize: deserialize_worker_Empty,
    responseSerialize: serialize_worker_Shard,
    responseDeserialize: deserialize_worker_Shard,
  },
  sysUsage: {
    path: '/worker.Worker/SysUsage',
    requestStream: false,
    responseStream: true,
    requestType: proto_worker_pb.Empty,
    responseType: proto_worker_pb.Usage,
    requestSerialize: serialize_worker_Empty,
    requestDeserialize: deserialize_worker_Empty,
    responseSerialize: serialize_worker_Usage,
    responseDeserialize: deserialize_worker_Usage,
  },
};

exports.WorkerClient = grpc.makeGenericClientConstructor(WorkerService);
var PoolService = exports.PoolService = {
  compile: {
    path: '/worker.Pool/Compile',
    requestStream: false,
    responseStream: false,
    requestType: proto_worker_pb.Compilation,
    responseType: proto_worker_pb.CompileResult,
    requestSerialize: serialize_worker_Compilation,
    requestDeserialize: deserialize_worker_Compilation,
    responseSerialize: serialize_worker_CompileResult,
    responseDeserialize: deserialize_worker_CompileResult,
  },
  run: {
    path: '/worker.Pool/Run',
    requestStream: false,
    responseStream: false,
    requestType: proto_worker_pb.Testrun,
    responseType: proto_worker_pb.TestResult,
    requestSerialize: serialize_worker_Testrun,
    requestDeserialize: deserialize_worker_Testrun,
    responseSerialize: serialize_worker_TestResult,
    responseDeserialize: deserialize_worker_TestResult,
  },
};

exports.PoolClient = grpc.makeGenericClientConstructor(PoolService);
