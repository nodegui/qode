#pragma once

#include <string>
#include "json.hpp"

namespace JSON = nlohmann;
namespace qodeHelper {
  std::string getExecutablePath();
  std::string getExecutableDir();
  std::string mergePaths(std::string pathA, std::string pathB);
  bool checkIfFileExists (const std::string& filePath);
  JSON::json readConfig();
}


