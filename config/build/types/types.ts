export interface BuildPaths {
    entry: string;
    html: string;
    html404: string;
    output: string;
    src: string;
    public: string;
}

export type BuildMode = 'production' | 'development';

export interface BuildOptions {
    port: number;
    paths: BuildPaths;
    mode: BuildMode;
    analyzer?: boolean;
}