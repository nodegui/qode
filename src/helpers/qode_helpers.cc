#include "qode_helpers.h"
#include <iostream>
#ifdef _WIN32
#include <windows.h>
#endif

void QodeHelpers::setStartFile(QJsonDocument &conf)
{
  QJsonObject config = conf.object();
  QJsonValue distPath = config.value(QString("distPath"));
  if (distPath.isUndefined())
  {
    return;
  }
  QDir qodeDirectory(QCoreApplication::applicationDirPath());
  QString absoluteFilePath = QDir::cleanPath(qodeDirectory.absoluteFilePath(distPath.toString()));
  QByteArray existingNodeOptions = qgetenv("NODE_OPTIONS");
  QString startFileOption = QString(" --require ") + absoluteFilePath;
  qputenv("NODE_OPTIONS", existingNodeOptions.append(startFileOption));
}

void QodeHelpers::addLibraryPaths(QJsonDocument &conf)
{
  QJsonObject config = conf.object();
  QJsonValue libraryPaths = config.value(QString("libraryPaths"));
  QJsonArray empty;
  QJsonArray userSpecifiedLibPaths = libraryPaths.toArray(empty);
  QDir qodeDirectory(QCoreApplication::applicationDirPath());
  for (auto libPathRef : userSpecifiedLibPaths)
  {
    QString eachLibPath = libPathRef.toString();
    QString absoluteLibPath = QDir::cleanPath(qodeDirectory.absoluteFilePath(eachLibPath));
    QCoreApplication::addLibraryPath(absoluteLibPath);
  }
}

void QodeHelpers::setConsoleVisibility(QJsonDocument &conf)
{
  QJsonObject config = conf.object();
  QJsonValue hideConsole = config.value(QString("hideConsole"));
  if (hideConsole.toBool())
  {
#ifdef _WIN32
    HWND hWnd = GetConsoleWindow();
    ShowWindow(hWnd, SW_HIDE);
#endif
  }
}

QJsonDocument QodeHelpers::readConfig()
{
  QDir qodeDirectory(QCoreApplication::applicationDirPath());
  QJsonDocument empty;
  QString configFileName = "qode.json";
  if (qodeDirectory.exists(configFileName))
  {
    QFile configFile(qodeDirectory.filePath(configFileName));
    if (!configFile.open(QFile::ReadOnly | QFile::Text))
    {
      return empty;
    }
    auto configRaw = configFile.readAll();
    configFile.close();
    return QJsonDocument::fromJson(configRaw);
  }
  return empty;
}
