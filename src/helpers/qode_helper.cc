#include "qode_helper.h"
#include <fstream>
#include <sstream>
#include <iostream>

#if defined(_WIN32)
    #include <windows>
    #include <Shlwapi>
    #include <io> 
    
    #define access    _access_s
#endif

#ifdef __linux__
    #include <libgen.h>
    #include <unistd.h>
#endif

#ifdef __APPLE__
    #include <libgen.h>
    #include <limits.h>
    #include <mach-o/dyld.h>
    #include <unistd.h>
#endif


namespace qodeHelper {

#if defined(_WIN32)

std::string NodeIntegrationWin::getExecutablePath() {
   wchar_t rawPathName[MAX_PATH];
   GetModuleFileNameW(NULL, rawPathName, MAX_PATH);
   return std::string(rawPathName);
}

std::string NodeIntegrationWin::getExecutableDir() {
    std::string executablePath = getExecutablePath();
    char* executableDirPath = executablePath.c_str();
    PathRemoveFileSpecA(executableDirPath);
    return std::string(executableDirPath);
}

std::string NodeIntegrationWin::mergePaths(std::string pathA, std::string pathB) {
  return pathA+"\\"+pathB;
}

#endif

#ifdef __linux__

std::string getExecutablePath() {
   char rawPathName[PATH_MAX];
   realpath(PROC_SELF_EXE, rawPathName);
   return  std::string(rawPathName);
}

std::string getExecutableDir() {
    std::string executablePath = getExecutablePath();
    char *executablePathStr = new char[executablePath.length() + 1];
    strcpy(executablePathStr, executablePath.c_str());
    char* executableDir = dirname(executablePathStr);
    delete [] executablePathStr;
    return std::string(executableDir);
}

std::string mergePaths(std::string pathA, std::string pathB) {
  return pathA+"/"+pathB;
}

#endif

#ifdef __APPLE__
    std::string getExecutablePath() {
        char rawPathName[PATH_MAX];
        char realPathName[PATH_MAX];
        uint32_t rawPathSize = (uint32_t)sizeof(rawPathName);

        if(!_NSGetExecutablePath(rawPathName, &rawPathSize)) {
            realpath(rawPathName, realPathName);
        }
        return  std::string(realPathName);
    }

    std::string getExecutableDir() {
        std::string executablePath = getExecutablePath();
        char *executablePathStr = new char[executablePath.length() + 1];
        strcpy(executablePathStr, executablePath.c_str());
        char* executableDir = dirname(executablePathStr);
        delete [] executablePathStr;
        return std::string(executableDir);
    }

    std::string mergePaths(std::string pathA, std::string pathB) {
        return pathA+"/"+pathB;
    }
#endif


bool checkIfFileExists (const std::string& filePath) {
   return access( filePath.c_str(), 0 ) == 0;
}

JSON::json readConfig()
{
  std::string executableDir = getExecutableDir();
  std::string configFileName = "qode.json";
  std::string configFilePath = mergePaths(executableDir, configFileName);
  std::string rawConfig = "{}";

  if (checkIfFileExists(configFilePath))
    {
        std::ifstream configStream(configFilePath, std::ios::in | std::ios::binary);
        if (configStream)
        {
            std::ostringstream contents;
            contents << configStream.rdbuf();
            configStream.close();
            rawConfig = std::string(contents.str());
        }
    }
  
  JSON::json configJson = JSON::json::parse(rawConfig,nullptr, false);

  if (configJson.is_discarded()) { 
      std::cout << "Failed to parse qode.json: "<<rawConfig;
      return JSON::json::parse("{}",nullptr, false);
  }

  return configJson;
}

}
