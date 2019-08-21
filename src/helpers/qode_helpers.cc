#include "qode_helpers.h"

void QodeHelpers::setStartFile(QJsonDocument conf){
  QJsonObject config = conf.object();
  QJsonValue distPath = config.value(QString("distPath"));
  if(distPath.isUndefined()){
    return;
  }
  QDir qodeDirectory(QCoreApplication::applicationDirPath());
  QString absoluteFilePath = qodeDirectory.absoluteFilePath(distPath.toString());
  QByteArray existingNodeOptions = qgetenv("NODE_OPTIONS");
  QString startFileOption = QString(" --require ")+absoluteFilePath;
  qputenv("NODE_OPTIONS", existingNodeOptions.append(startFileOption));
}

QJsonDocument QodeHelpers::readConfig(){
  QDir qodeDirectory(QCoreApplication::applicationDirPath());
  QJsonDocument empty;
  QString configFileName = "qode.json";
  if(qodeDirectory.exists(configFileName)){
    QFile configFile(qodeDirectory.filePath(configFileName));
    if (!configFile.open(QFile::ReadOnly | QFile::Text)){ 
      return empty;
    }
    auto configRaw = configFile.readAll();
    configFile.close();
    return QJsonDocument::fromJson(configRaw);
  }
  return empty;
}
