import { quitIfWebGPUNotAvailable } from '../util';

export class Webgpu {
  device: GPUDevice | null;
  presentationFormat: GPUTextureFormat;
  pipeline: GPURenderPipeline | null;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext | null;

  constructor(id: string) {
    this.device = null;
    this.presentationFormat = 'bgra8unorm';
    this.pipeline = null;
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.context = null;
  }
  
  async initAdapter() {
    const canvas = this.canvas;
    const adapter = await navigator.gpu?.requestAdapter();

    let device = adapter ? await adapter?.requestDevice() : null;

    quitIfWebGPUNotAvailable(adapter, device);

    this.device = device;

    const context = canvas.getContext('webgpu') as GPUCanvasContext;

    this.context = context;

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
}  