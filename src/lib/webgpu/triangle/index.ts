import triangleVertWGSL from './shaders/triangle.vert.wgsl';
import triangleFragWGSL from './shaders/triangle.frag.wgsl';

import { Webgpu } from '../basic/webgpu.ts';

export class Triangle extends Webgpu {
  pipeline: GPURenderPipeline | null;
  canvas: HTMLCanvasElement;
  verticesBuffer: GPUBuffer | null;

  constructor(id: string) {
    super(id);

    this.pipeline = null;
    this.verticesBuffer = null;
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
  }
  
  async init() {
    await this.initAdapter();
    this.initPipe();
    this.render();
  }

 

  initPipe () {
    const device = this.device;
    const presentationFormat = this.presentationFormat;
    
    if(!device || !presentationFormat) { 
      return 
    }

    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({
          code: triangleVertWGSL,
        }),
      },
      fragment: {
        module: device.createShaderModule({
          code: triangleFragWGSL,
        }),
        targets: [
          {
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    this.pipeline = pipeline || null;
  }


  render() {
    const device = this.device;
    const pipeline = this.pipeline;
    const canvas = this.canvas;
    const context = this.context

    
    function frame() {
      if (!device ||!pipeline ||!canvas ||!context) {
        return;
      }

      const commandEncoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();
    
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: textureView,
            clearValue: [0, 0, 0, 0], // Clear to transparent
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      };
    
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.setPipeline(pipeline);
      passEncoder.draw(3);
      passEncoder.end();
    
      device.queue.submit([commandEncoder.finish()]);
      requestAnimationFrame(frame);
    }
    
    frame();
  }
}  