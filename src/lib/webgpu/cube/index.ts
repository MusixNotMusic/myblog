import { mat4, vec3 } from 'wgpu-matrix';

import {
  cubeVertexArray,
  cubeVertexSize,
  cubeUVOffset,
  cubePositionOffset,
  cubeVertexCount,
} from '../../meshes/cube';

import basicVertWGSL from '../shaders/basic.vert.wgsl';
import vertexPositionColorWGSL from '../shaders/vertexPositionColor.frag.wgsl';

import { quitIfWebGPUNotAvailable } from '../util';

export class Cube {
  device: GPUDevice | null;
  presentationFormat: GPUTextureFormat;
  pipeline: GPURenderPipeline | null;
  canvas: HTMLCanvasElement;
  verticesBuffer: GPUBuffer | null;
  _render: () => void;

  constructor(id: string) {
    this.device = null;
    this.presentationFormat = 'bgra8unorm';
    this.pipeline = null;
    this.verticesBuffer = null;
    this.canvas = document.getElementById(id) as HTMLCanvasElement;

    this._render = this.render.bind(this)
  }
  
  async initAdapter() {
    const canvas = this.canvas;
    const adapter = await navigator.gpu?.requestAdapter();

    let device = adapter ? await adapter?.requestDevice() : null;

    quitIfWebGPUNotAvailable(adapter, device);

    this.device = device;

    const context = canvas.getContext('webgpu') as GPUCanvasContext;

    const devicePixelRatio = window.devicePixelRatio;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    this.presentationFormat = presentationFormat;

    context.configure({
      device,
      format: presentationFormat,
    });
  }

  async init() {
    await this.initAdapter();
    this.initVertexBuffers();
    this.initPipe();
    this.render();
  }

  initVertexBuffers() {
    const device = this.device;
    

    const vertexBuffer = device?.createBuffer({
      size: cubeVertexArray.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });

    if (!vertexBuffer) {
      console.error('Failed to create vertex buffer.');
      return;
    }

    new Float32Array(vertexBuffer.getMappedRange()).set(cubeVertexArray);
    vertexBuffer?.unmap();

    this.verticesBuffer = vertexBuffer;
  }

  initPipe () {
    const device = this.device;
    const presentationFormat = this.presentationFormat;

    const pipeline = device?.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({
          code: basicVertWGSL,
        }),
        buffers: [
          {
            arrayStride: cubeVertexSize,
            attributes: [
              {
                // position
                shaderLocation: 0,
                offset: cubePositionOffset,
                format: 'float32x4',
              },
              {
                // uv
                shaderLocation: 1,
                offset: cubeUVOffset,
                format: 'float32x2',
              },
            ],
          },
        ],
      },
      fragment: {
        module: device.createShaderModule({
          code: vertexPositionColorWGSL,
        }),
        targets: [
          {
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
    
        // Backface culling since the cube is solid piece of geometry.
        // Faces pointing away from the camera will be occluded by faces
        // pointing toward the camera.
        cullMode: 'back',
      },
    
      // Enable depth testing so that the fragment closest to the camera
      // is rendered in front.
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    });

    this.pipeline = pipeline || null;
  }


  render() {
    const device = this.device;
    const pipeline = this.pipeline;
    const canvas = this.canvas;
    const verticesBuffer = this.verticesBuffer;

    const context = canvas.getContext('webgpu') as GPUCanvasContext;

    if (!device || !pipeline || !canvas || !this.verticesBuffer) {
      return;
    }

    const depthTexture = device?.createTexture({
      size: [this.canvas.width, this.canvas.height],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    
    const matrixSize = 4 * 16; // 4x4 matrix
    const offset = 256; // uniformBindGroup offset must be 256-byte aligned
    const uniformBufferSize = offset + matrixSize;
    
    const uniformBuffer = device?.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    
    const uniformBindGroup1 = device?.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
            offset: 0,
            size: matrixSize,
          },
        },
      ],
    });
    
    const uniformBindGroup2 = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
            offset: offset,
            size: matrixSize,
          },
        },
      ],
    });
    
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: undefined, // Assigned later
    
          clearValue: [0.5, 0.5, 0.5, 1.0],
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
    
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    };

    const aspect = canvas.width / canvas.height;
    const projectionMatrix = mat4.perspective((2 * Math.PI) / 5, aspect, 1, 100.0);

    const modelMatrix1 = mat4.translation(vec3.create(-2, 0, 0));
    const modelMatrix2 = mat4.translation(vec3.create(2, 0, 0));
    const modelViewProjectionMatrix1 = mat4.create();
    const modelViewProjectionMatrix2 = mat4.create();
    const viewMatrix = mat4.translation(vec3.fromValues(0, 0, -7));

    const tmpMat41 = mat4.create();
    const tmpMat42 = mat4.create();

    function updateTransformationMatrix() {
      const now = Date.now() / 1000;

      mat4.rotate(
        modelMatrix1,
        vec3.fromValues(Math.sin(now), Math.cos(now), 0),
        1,
        tmpMat41
      );
      mat4.rotate(
        modelMatrix2,
        vec3.fromValues(Math.cos(now), Math.sin(now), 0),
        1,
        tmpMat42
      );

      mat4.multiply(viewMatrix, tmpMat41, modelViewProjectionMatrix1);
      mat4.multiply(
        projectionMatrix,
        modelViewProjectionMatrix1,
        modelViewProjectionMatrix1
      );
      mat4.multiply(viewMatrix, tmpMat42, modelViewProjectionMatrix2);
      mat4.multiply(
        projectionMatrix,
        modelViewProjectionMatrix2,
        modelViewProjectionMatrix2
      );
    }
    const frame = () => {
      updateTransformationMatrix();
      if(!device || !pipeline || !canvas || !renderPassDescriptor) {
        return;
      }

      device.queue.writeBuffer(
        uniformBuffer,
        0,
        modelViewProjectionMatrix1.buffer,
        modelViewProjectionMatrix1.byteOffset,
        modelViewProjectionMatrix1.byteLength
      );
      device.queue.writeBuffer(
        uniformBuffer,
        offset,
        modelViewProjectionMatrix2.buffer,
        modelViewProjectionMatrix2.byteOffset,
        modelViewProjectionMatrix2.byteLength
      );

      (renderPassDescriptor as any).colorAttachments[0].view = context
        .getCurrentTexture()
        .createView();

      const commandEncoder = device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.setPipeline(pipeline);
      passEncoder.setVertexBuffer(0, verticesBuffer);

      // Bind the bind group (with the transformation matrix) for
      // each cube, and draw.
      passEncoder.setBindGroup(0, uniformBindGroup1);
      passEncoder.draw(cubeVertexCount);

      passEncoder.setBindGroup(0, uniformBindGroup2);
      passEncoder.draw(cubeVertexCount);

      passEncoder.end();
      device.queue.submit([commandEncoder.finish()]);

      requestAnimationFrame(_frame);
    }

    const _frame = frame.bind(this);
    
    frame();
  }
}  