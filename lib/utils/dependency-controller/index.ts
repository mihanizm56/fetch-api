import { BaseRequest } from "@/requests/base-request"
import { DependencyType } from "@/types"

interface IDependencyController {
    setDependency: (options:DependencyType) => void;
    setDependencies: (options:Array<DependencyType>) => void;
    getDependency: (name: string) => void;
    getDependencies: () => void;
    checkIfDependenciesExist: () => void;
}


export class DependencyController implements IDependencyController{
    checkIfDependenciesExist(){
        if(!BaseRequest.dependencies){
            BaseRequest.dependencies = {}
        }
    }

    setDependency({name, value}: DependencyType){
        try {
            this.checkIfDependenciesExist();

            BaseRequest.dependencies[name] = value
        } catch (error) {
            console.error('setDependency gets an error', error);
        }
    }
    setDependencies(options: Array<DependencyType>){
        try {
            this.checkIfDependenciesExist();

            options.forEach(({name, value}: DependencyType) => {
                BaseRequest.dependencies[name] = value
            });
        } catch (error) {
            console.error('setDependencies gets an error', error);
        }
    }
    getDependency(name: string){
        try {
            this.checkIfDependenciesExist();

            return BaseRequest.dependencies[name]  
        } catch (error) {
            console.error('getDependency gets an error', error);
        }
    }
    getDependencies(){
        try {
            this.checkIfDependenciesExist();

            return BaseRequest.dependencies
        } catch (error) {
            console.error('getDependencies gets an error', error);
        }
    }
}
