// src/hooks/useResources.js
import { useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import * as THREE from 'three';

class Resources extends EventEmitter {
    constructor(assets) {
        super();
        this.items = {};
        this.assets = assets;
        this.location = "westgate";
        this.loaders = new Loaders().loaders;
        this.startLoading();
    }

    startLoading() {
        this.loaded = 0;
        this.queue = this.assets[0][this.location].assets.length;

        for (const asset of this.assets[0][this.location].assets) {
            if (asset.type === "glbModel") {
                this.loaders.gltfLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset, file);
                });
            } else if (asset.type === "imageTexture") {
                this.loaders.textureLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset, file);
                });
            } else if (asset.type === "cubeTexture") {
                this.loaders.cubeTextureLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset, file);
                });
            } else if (asset.type === "videoTexture") {
                this.video = {};
                this.videoTexture = {};

                this.video[asset.name] = document.createElement("video");
                this.video[asset.name].src = asset.path;
                this.video[asset.name].muted = true;
                this.video[asset.name].playsInline = true;
                this.video[asset.name].autoplay = true;
                this.video[asset.name].loop = true;
                this.video[asset.name].play();

                this.videoTexture[asset.name] = new THREE.VideoTexture(
                    this.video[asset.name]
                );
                this.videoTexture[asset.name].flipY = false;
                this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].generateMipmaps = false;
                this.videoTexture[asset.name].colorSpace = THREE.SRGBColorSpace;

                this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
            }
        }
    }

    singleAssetLoaded(asset, file) {
        this.items[asset.name] = file;
        this.loaded++;
        this.emit("loading", this.loaded, this.queue);

        if (this.loaded === this.queue) {
            this.emit("ready");
        }
    }
}

export const useResources = (assets) => {
    const [resources, setResources] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const res = new Resources(assets);

        res.on('loading', (loaded, total) => {
            setLoadingProgress((loaded / total) * 100);
        });

        res.on('ready', () => {
            setResources(res.items);
        });

        return () => {
            // Cleanup if necessary
        };
    }, [assets]);

    return { resources, loadingProgress };
};
