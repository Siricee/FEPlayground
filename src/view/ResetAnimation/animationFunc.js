/* eslint-disable */
import * as TWEEN from "./tween.esm.js";
import * as THREE from "three";
// current 相机当前的位置
// target 相机的目标位置
// camera
export function animateCamera(mesh, targetPosition, controls) {
	mesh.up.set(0,1,0)
	mesh.updateProjectionMatrix()
	let angle = mesh.position.angleTo(targetPosition) // camera位置向量与目标位向量夹角
	// let yAxisUpSpace = new THREE.Quaternion().setFromUnitVectors(mesh.up, new THREE.Vector3(0, 1, 0))
	// let yAxisUpSpaceInverse = yAxisUpSpace.invert()
	// let ans = new THREE.Vector3().setFromSpherical(new THREE.Spherical()).applyQuaternion(yAxisUpSpaceInverse).normalize() //.negate()
	// mesh.up.set(...ans)
	let progress = { angle, value: 0 }

	let rotateAxes = new THREE.Vector3().crossVectors(mesh.position, targetPosition) // 旋转轴

	const tween = new TWEEN.Tween(progress);
	const clock = new THREE.Clock()
	const durationTime = 1000
	tween.to({ angle: 0, value: 1 }, durationTime).easing(TWEEN.Easing.Linear.None).onUpdate((progress) => {
		const t = clock.getDelta()

		// console.log(t)
		// let tarEnd = new THREE.Vector3().copy(mesh.position.lerp(targetPosition,progress.value))
		// let Tm = new THREE.Matrix4().makeTranslation(targetPosition)
		let Rm = new THREE.Matrix4().makeRotationAxis(rotateAxes.normalize(), t * THREE.MathUtils.radToDeg(angle) / 60)
		mesh.applyMatrix4(new THREE.Matrix4().multiply(Rm))
		// mesh.updateProjectionMatrix()
	}).onComplete(() => {
		// // mesh.up.set(new THREE.Vector3(0,1,0))
		controls.update()
		rotateCamera(mesh);

	}).start()
}
const rotateCamera = (camera) => {
	let vec = new THREE.Vector3(1, 0, 0);
	let rotateMai = getRoteTransMatrix(new THREE.Vector3(), vec, 0);
	camera.applyMatrix4(rotateMai);
}
function getRoteTransMatrix(center, dir, roteangle) {

	let result = new THREE.Matrix4();

	//正弦值 解决精度不够问题
	let vSin = Math.round(Math.sin((roteangle)) * 1000000) / 1000000; //vAngle * Math.PI/180
	//余弦值
	let vCos = Math.round(Math.cos((roteangle)) * 1000000) / 1000000;

	let mRz = new THREE.Matrix4();
	mRz.set(vCos, vSin, 0, 0,
		-vSin, vCos, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1);
	mRz.transpose();

	if (roteangle == 0 || roteangle == Math.PI) {
		result = mRz;
		return result;
	}

	let mTa = new THREE.Matrix4();
	let minvTa = new THREE.Matrix4();
	mTa.set(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		-center.x, -center.y, -center.z, 1);

	minvTa.set(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		center.x, center.y, center.z, 1);

	mTa.transpose();
	minvTa.transpose();

	let v = Math.sqrt(dir.y * dir.y + dir.z * dir.z);
	let cosalpha;
	let sinalpha;
	if (v != 0) {
		cosalpha = dir.z / v;
		sinalpha = dir.y / v;
	}
	else {
		cosalpha = 1;
		sinalpha = 0;
	}

	let mRx = new THREE.Matrix4();
	let minvRx = new THREE.Matrix4();

	mRx.set(
		1, 0, 0, 0,
		0, cosalpha, sinalpha, 0,
		0, -sinalpha, cosalpha, 0,
		0, 0, 0, 1);

	minvRx.set(
		1, 0, 0, 0,
		0, cosalpha, -sinalpha, 0,
		0, sinalpha, cosalpha, 0,
		0, 0, 0, 1);

	mRx.transpose();
	minvRx.transpose();

	let u = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
	let cosbeta = v / u;
	let sinbeta = -dir.x / u;
	let mRy = new THREE.Matrix4();
	let minvRy = new THREE.Matrix4();

	mRy.set(
		cosbeta, 0, -sinbeta, 0,
		0, 1, 0, 0,
		sinbeta, 0, cosbeta, 0,
		0, 0, 0, 1
	);
	minvRy.set(
		cosbeta, 0, sinbeta, 0,
		0, 1, 0, 0,
		-sinbeta, 0, cosbeta, 0,
		0, 0, 0, 1);

	mRy.transpose();
	minvRy.transpose();

	result.premultiply(mTa);
	result.premultiply(mRx);
	result.premultiply(mRy);
	result.premultiply(mRz);
	result.premultiply(minvRy);
	result.premultiply(minvRx);
	result.premultiply(minvTa);

	return result;
}
export function animateTest(camera, target, controls) {
	let tween = new TWEEN.Tween(camera.position)
	let box3 = new THREE.Box3().setFromObject(target)
	let center = box3.getCenter(new THREE.Vector3())
	let size = box3.getSize(new THREE.Vector3())
	tween.to({ x: center.x, y: center.y, z: center.z + size.z + 20 }, 1000).easing(TWEEN.Easing.Cubic.InOut).onUpdate(() => {
		camera.lookAt(center)
		controls.update()
	}).start()
}