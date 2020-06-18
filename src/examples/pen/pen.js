import {
  Mesh,
  Line,
  Points,
  BufferGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Object3D,
  SphereBufferGeometry,
  Vector3,
  Float32BufferAttribute,
  PointsMaterial,
  TextureLoader,
} from "three";
import State from "../../engine/state";
import XRInput from "../../engine/xrinput";

const imgPath = require("./assets/disc4.png");

export default class Pen extends Object3D {
  constructor(scene, networking, params) {
    super(params);
    this.networking = networking;
    (this.scene = scene), (this.isDrawing = false);
    this.undoBreak = false;
    this.activeController = null;
    this.activeInputSource = null;
    this.previousPosition = new Vector3();
    this.paintContainer = [];
    this.objCounter = 0;

    State.eventHandler.addEventListener(
      "selectstart",
      this.StartDrawing.bind(this)
    );
    State.eventHandler.addEventListener(
      "selectend",
      this.StopDrawing.bind(this)
    );

    //shapes
    this.material = new MeshBasicMaterial({
      color: 0x00ffff, //this.data.color,
      side: DoubleSide,
      flatShading: true,
    });
    this.sphereGeometry = new SphereBufferGeometry(1, 12, 12);

    //texture
    const loader = new TextureLoader();
    loader.load(imgPath, img => {
      this.particleTexture = img;
    });
  }

  StartDrawing(e) {
    console.log("drawing");
    this.isDrawing = true;
    this.activeInputSource = e.inputSource;
    XRInput.inputSources.forEach((ctrl, index) => {
      if (ctrl == e.inputSource) {
        this.activeControllerGrip = XRInput.controllerGrips[index];
      }
    });
  }
  StopDrawing(e) {
    console.log("stopping");
    this.isDrawing = false;
    this.activeController = null;
  }

  AddSphere(position, orientation, pressure) {
    var point = new Mesh(this.sphereGeometry, this.material);
    var sca = pressure * 0.05 * Math.random();
    point.scale.set(sca, sca, sca);
    point.position.copy(position);
    point.rotation.copy(orientation);
    const curPosRotSca = {
      position: position,
      rotation: orientation,
      scale: sca,
    };
    this.scene.add(point);
    this.networking.remoteSync.addLocalObject(
      point,
      { type: "sphere", posRotSca: curPosRotSca },
      false
    );
    return point;
  }

  AddLine(position, orientation, pressure) {
    var points = [];
    points.push(this.previousPosition);
    points.push(position);
    var geometry = new BufferGeometry().setFromPoints(points);

    var line = new Line(geometry, this.material);
    this.scene.add(line);
    this.previousPosition = position;
  }

  AddPoint(position, orientation, pressure) {
    var points = [];
    var tgeometry = new BufferGeometry();

    points.push(position.x, position.y, position.z);

    tgeometry.setAttribute("position", new Float32BufferAttribute(points, 3));

    this.pmaterial = new PointsMaterial({
      color: 0xffffff,
      alphaTest: 0.5,
      transparent: true,
      map: this.particleTexture,
      alphaMap: this.particleTexture,
      size: this.currentPressure * 0.65,
    });
    var point = new Points(tgeometry, this.pmaterial);
    this.scene.add(point);
  }
  Undo() {
    this.remove(this.children[this.children.length - 1]);
    this.undoBreak = true;
    setTimeout(() => {
      this.undoBreak = false;
    }, 10);
  }

  Update() {
    if (this.activeControllerGrip) {
      if (this.isDrawing) {
        this.activeInputSource.gamepad.buttons.forEach(btn => {
          if (btn.value != 0) this.currentPressure = btn.value / 3;
        });
        this.AddSphere(
          this.activeControllerGrip.position,
          this.activeControllerGrip.rotation,
          this.currentPressure
        );
        // this.AddPoint(
        //   this.activeControllerGrip.position,
        //   this.activeControllerGrip.rotation,
        //   this.currentPressure
        // );
      } else {
        this.activeInputSource.gamepad.axes.forEach(axis => {
          if (this.undoBreak) return;
          if (axis != 0) {
            this.Undo();
          }
        });
      }
    }
  }
}
