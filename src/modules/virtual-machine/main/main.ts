import axios from "axios";


async function createNewVmSerivce() {

    try {
        const { data: allDevices } = await axios.get("/app/v1/device/get-all-devices")
        const { data: installedServices } = await axios.get("/app/v1/installed-service/get-all-installed-services")
        const { data: allServices } = await axios.get("/app/v1/service/get-all-services")

        allDevices.map((device)=> {
            installedServices.map((installedService) => {
                if  ( installedService.deviceMap.MULTI_SENSOR_1.toString() === device.deviceEncryptedId.toString() ) {
                    allServices.map((service) => {
                        if ( service._id.toString() === installedService.serviceId.toString() ) {
                            
                            let installedServiceOutput = JSON.stringify(installedService).replaceAll(
                                /\r?\n|\r/g,
                                ' ',
                            );
                            let parsedInstalledService = JSON.parse(installedServiceOutput);
                            let parsedInstalledServiceCode = parsedInstalledService.code;
                            
                            

                        }
                    })
                }
            })
        })

    } catch (error) {
        console.log(error);
    }
}

export default createNewVmSerivce;